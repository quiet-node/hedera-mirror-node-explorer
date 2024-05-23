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

import {Block, BlocksResponse} from "@/schemas/HederaSchemas";
import {Timestamp} from "@/utils/Timestamp";
import axios, {AxiosResponse} from "axios";

export class BlockQueue {

    public blocks: Block[] = []

    //
    // Public
    //

    public constructor(readonly durationMinutes: number) {}

    public async update(): Promise<void> {
        const blockCount = this.blocks.length
        const lastBlock = blockCount >= 1 ? this.blocks[blockCount - 1] : null
        const lastBlockNb = lastBlock?.number ?? null

        const startTime = Date.now() - this.durationMinutes * 60 * 1000

        const newBlocks = await BlockQueue.loadBlocks(startTime, lastBlockNb)
        const firstNewBlock = newBlocks.length >= 1 ? newBlocks[0] : null
        if (firstNewBlock !== null && firstNewBlock.number == lastBlockNb) {
            // firstNewBlock matches lastBlock => removes it from newBlocks (because it's duplicate)
            newBlocks.splice(0, 1)
            const oldBlocks = BlockQueue.removeObsoleteBlocks(this.blocks, Timestamp.fromMillis(startTime).toString())
            console.log("newItems.length=" + newBlocks.length + " => " + (this.blocks.length - oldBlocks.length))
            this.blocks = oldBlocks.concat(newBlocks)
        } else {
            this.blocks = newBlocks
            console.log("newBlocks.length=" + newBlocks.length + " => no preserved item")
        }
    }

    //
    // Private
    //

    private static async loadBlocks(startTime: number, lastBlockNb: number|null): Promise<Block[]> {

        const startTimestamp = Timestamp.fromMillis(startTime).toString()
        const timestampFilter = "&timestamp=gte:" + startTimestamp.toString()
        const blockFilter = lastBlockNb !== null ? "&block.number=gte:" + lastBlockNb : ""

        let result: Block[] = []
        let nextURL: string|null = "api/v1/blocks?limit=100" + timestampFilter + blockFilter
        while (nextURL !== null) {
            const response: AxiosResponse<BlocksResponse> = await axios.get<BlocksResponse>(nextURL)
            result = result.concat(response.data.blocks ?? [])
            nextURL = response.data.links?.next ?? null
        }
        result.reverse()
        return result
    }
    //
    // private static makeItems(blocks: Block[]): BlockItem[] {
    //     const result: BlockItem[] = []
    //     for (const block of blocks) {
    //         if (block.timestamp?.from && block.timestamp.to && block.number) {
    //             const fromTime = Timestamp.roundToMillis(block.timestamp.from)
    //             const toTime = Timestamp.roundToMillis(block.timestamp.to)
    //             if (fromTime !== null && toTime !== null && fromTime < toTime) {
    //                 result.push({
    //                     fromTime: fromTime,
    //                     toTime: toTime,
    //                     blockNb: block.number,
    //                     transactionCount: block.count ?? 0
    //                 })
    //             } else {
    //                 console.log("HAAAA: skipping block " + block.number)
    //             }
    //         }
    //     }
    //     return result
    // }

    private static removeObsoleteBlocks(blocks: Block[], startTimestamp: string): Block[] {
        let i = 0
        while (i < blocks.length && this.isObsoleteBlock(blocks[i], startTimestamp)) {
            i += 1
        }
        let result: Block[]
        if (i < blocks.length) {
            result = blocks.slice()
            result.splice(0, i)
        } else {
            result = []
        }
        return result
    }

    private static isObsoleteBlock(block: Block, startTimestamp: string): boolean {
        let result: boolean
        if (block.timestamp?.from) {
            result = block.timestamp.from < startTimestamp
        } else {
            result = true
        }
        return result
    }
}
