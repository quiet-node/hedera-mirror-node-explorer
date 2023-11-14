/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {ref} from "vue";
import {SolcUtils} from "@/utils/solc/SolcUtils";
import {HHUtils} from "@/utils/hardhat/HHUtils";

export class SolidityFileImporter {

    public readonly started = ref(false)
    public readonly files = ref<Map<string, string>>(new Map())
    public readonly failure = ref<unknown>(null)

    //
    // Public
    //

    public start(transferList: DataTransferItemList | FileList) {
        if (this.started.value) {
            console.log("SolidityFileImporter aborts because it's already importing")
        } else {

            // DataTransferItemList is reset immediately after drop callback termination
            // => we copy file system entries before going async
            const entries: Array<FileSystemEntry | File> = []
            for (const i of transferList) {
                if (transferList instanceof FileList) {
                    entries.push(i as File)
                } else {
                    const e = (i as DataTransferItem).webkitGetAsEntry()
                    if (e !== null) {
                        entries.push(e)
                    }
                }
            }

            // Async starts here
            this.started.value = true
            const newFiles = new Map<string, string>()
            SolidityFileImporter.importEntries(entries, newFiles)
                .then(() => {
                    this.files.value = newFiles
                    this.failure.value = null

                })
                .catch((reason: unknown) => {
                    // this.files.value is left unchanged
                    this.failure.value = reason
                    console.log("SolidityFileImporter.start did crash:" + reason)
                })
                .finally( () => {
                    this.started.value = false
                })
        }
    }

    public reset() {
        this.files.value = new Map()
        this.failure.value = null
    }

    //
    // Private
    //

    private static async importEntries(entries: Array<FileSystemEntry | File>, output: Map<string, string>): Promise<void> {
        for (const e of entries) {
            if (e instanceof File) {
                await this.importFile(e, output)
            } else {
                await this.importEntry(e, output)
            }
        }
    }

    private static async importEntry(e: FileSystemEntry, output: Map<string, string>): Promise<void> {
        if (e !== null) {
            if (e.isFile) {
                const fileName = e!.name
                const fullPath = e!.fullPath
                const relativePath = fullPath.indexOf("/") == 0 ? fullPath.substring(1) : fullPath
                if (hasExtension(fileName, ".sol")) {
                    const content = await asyncReadText(e as FileSystemFileEntry)
                    output.set(relativePath, content)
                } else if (hasExtension(fileName, ".json")) {
                    const content = await asyncReadText(e as FileSystemFileEntry)
                    if (SolcUtils.parseSolcMetadata(content) !== null
                        || SolcUtils.parseSolcInput(content) !== null
                        || HHUtils.parseMetadata(content) !== null) {
                        output.set(relativePath, content)
                    }
                }
            } else if (e.isDirectory) {
                const d = e as FileSystemDirectoryEntry
                for (const c of await asyncReadEntries(d)) {
                    const skip = c.name.startsWith(".") || c.name == "node_modules"
                    if (!skip) {
                        await this.importEntry(c, output)
                    }
                }
            } else {
                console.log("SolidityFileImporter ignored unexpected FileSystemEntry subclass: " + typeof e)
            }
        }
    }

    private static async importFile(f: File, output: Map<string, string>): Promise<void> {
        if (f !== null) {
            const fileName = f.name
            if (hasExtension(fileName, ".sol")) {
                const content = await asyncReadTextFromFile(f)
                output.set(fileName, content)
            } else if (hasExtension(fileName, ".json")) {
                const content = await asyncReadTextFromFile(f)
                if (SolcUtils.parseSolcMetadata(content) !== null
                    || SolcUtils.parseSolcInput(content) !== null
                    || HHUtils.parseMetadata(content) !== null) {
                    output.set(fileName, content)
                }
            }
        }
    }
}


async function asyncReadText(e: FileSystemFileEntry): Promise<string> {

    return new Promise<string>((resolve, reject) => {
        e.file((file: File) => {
            resolve(file.text())
        }, (error: unknown) => {
            reject(error)
        })
    })
}

async function asyncReadTextFromFile(f: File): Promise<string> {
    return Promise.resolve(f.text())
}

async function asyncReadEntries(e: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
    let result: FileSystemEntry[] = [];
    return new Promise<FileSystemEntry[]>((resolve, reject) => {
        const reader = e.createReader()
        const readEntries = () => {
            reader.readEntries((files: FileSystemEntry[]) => {
                if (files.length >= 1) {
                    result = result.concat(files)
                    readEntries()
                } else {
                    resolve(result)
                }
            }, (reason: unknown) => {
                reject(reason)
            })
        }
        readEntries()
    })
}

function hasExtension(fileName: string, extension: string): boolean {
    const n = fileName.toLowerCase()
    const x = extension.toLowerCase()
    return n.lastIndexOf(x) == n.length - x.length
}
