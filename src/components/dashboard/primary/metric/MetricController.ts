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

export abstract class MetricController {

    private mounted = false
    private timeoutID = -1

    //
    // Public
    //

    public constructor(readonly refreshPeriod: number = 10 * 60 * 1000 /* 10mn */) {}

    public mount(): void {
        this.mounted = true
        this.loadNow()
    }

    public unmount(): void {
        this.mounted = false
    }

    public remount(): void {
        this.unmount()
        this.mount()
    }

    //
    // Protected (to be subclassed)
    //

    protected async update(): Promise<void> {
        throw "To be implemented"
    }


    //
    // Private
    //

    private loadNow() {
        this.cancelNextLoad() // Should not be needed unless double mount()…
        this.update().finally(() => {
            if (this.mounted && this.refreshPeriod > 0) {
                this.scheduleNextLoad()
            } // else silently exists because we have been unmounted
        })
    }

    private scheduleNextLoad() {
        this.timeoutID = window.setTimeout(() => {
            this.loadNow()
        }, this.refreshPeriod)
    }

    private cancelNextLoad() {
        if (this.timeoutID != -1) {
            window.clearTimeout(this.timeoutID)
            this.timeoutID = -1
        }
    }
}
