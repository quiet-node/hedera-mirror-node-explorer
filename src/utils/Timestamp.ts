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

export class Timestamp {

    public readonly seconds: number
    public readonly nanoseconds: number

    //
    // Public
    //

    public static parse(timestamp: string): Timestamp | null {
        let result: Timestamp | null

        const i = timestamp.indexOf(".")
        const s = i != -1 ? timestamp.slice(0, i) : null
        const n = i != -1 ? timestamp.slice(i + 1) : null
        if (s !== null && n !== null && n.indexOf(".") == -1) {
            const seconds = parseInt(s)
            const nanoseconds = parseInt(n)
            if (isNaN(seconds) || isNaN(nanoseconds)) {
                result = null
            } else {
                result = new Timestamp(seconds, nanoseconds)
            }
        } else {
            result = null
        }

        return result
    }

    public static fromMillis(millis: number): Timestamp  {
        const seconds: number = Math.floor(millis / 1000)
        const nanoseconds = (millis - 1000 * seconds) * 1_000_000
        return new Timestamp(seconds, nanoseconds)
    }

    public static roundToMillis(timestamp: string): number|null {
        let result: number|null
        const ts = Timestamp.parse(timestamp)
        if (ts !== null) {
            result = ts.seconds * 1000 + Math.round(ts.nanoseconds / 1_000_000)
        } else {
            result = null
        }
        return result
    }

    public toString(): string {
        return this.seconds + "." + this.nanoseconds.toString().padStart(9, "0")
    }

    public roundToMillis(): number {
        return this.seconds * 1000 + Math.round(this.nanoseconds / 1_000_000)
    }

    public nanoSeconds(from: Timestamp): number {
        const secondDelta = this.seconds - from.seconds
        const nanosecondDelta = this.nanoseconds - from.nanoseconds
        return secondDelta * 1_000_000_000 + nanosecondDelta
    }

    //
    // Private
    //

    private constructor(seconds: number, nanoseconds: number) {
        this.seconds = seconds
        this.nanoseconds = nanoseconds
    }
}
