/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
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

import {BlockQueue} from "@/components/dashboard/primary/series/BlockQueue";
import {Block} from "@/schemas/HederaSchemas";
import {Timestamp} from "@/utils/Timestamp";
import {EntityLoaderV2} from "@/utils/loader/EntityLoaderV2";

export class TPSSeriesLoader extends EntityLoaderV2<TPSRecord[]> {

    private readonly blockQueue = new BlockQueue(5 /* minutes */);

    //
    // Public
    //

    public constructor() {
        super(15 * 1000, 200)
    }

    //
    // HgraphSeriesLoader
    //

    protected async load(): Promise<TPSRecord[]> {
        await this.blockQueue.update()
        return Promise.resolve(TPSSeriesLoader.makeRecords(this.blockQueue.blocks))
    }


    //
    // Private
    //

    private static makeRecords(blocks: Block[]): TPSRecord[] {
        const result: TPSRecord[] = []
        for (const block of blocks) {
            const newRecord = this.makeRecord(block)
            if (newRecord !== null) {
                result.push(newRecord)
            }
        }
        return result
    }

    private static makeRecord(block: Block): TPSRecord|null {
        let result: TPSRecord|null

        const fromTimestamp = block.timestamp?.from
        const toTimestamp = block.timestamp?.to
        const transactionCount = block.count
        if (fromTimestamp && toTimestamp && transactionCount) {
            const fromTT = Timestamp.parse(fromTimestamp)
            const toTT = Timestamp.parse(toTimestamp)
            if (fromTT && toTT) {
                const duration = toTT.nanoSeconds(fromTT) / 1_000_000_000
                const tps = transactionCount / duration
                result = { time: toTT.roundToMillis(), tps: tps }
            } else {
                result = null
            }
        } else {
            result = null
        }

        return result
    }

}

export interface TPSRecord {
    time: number
    tps: number
}
