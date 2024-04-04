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

import {ref, watch, WatchStopHandle} from "vue";
import * as am5 from '@amcharts/amcharts5'
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark"

export abstract class ChartController {

    public readonly container = ref<HTMLDivElement|null>(null)
    private watchHandle: WatchStopHandle|null = null
    private chartRoot: am5.Root|null = null

    //
    // Public
    //

    public mount() {
        this.watchHandle = watch(this.container, this.containerDidChange, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
        if (this.chartRoot !== null) {
            this.chartRoot.dispose()
            this.chartRoot = null
        }
    }

    //
    // Protected (to be subclassed)
    //

    protected abstract setup(chartRoot: am5.Root): void

    //
    // Private
    //

    private readonly containerDidChange = () => {

        if (this.chartRoot !== null) {
            this.chartRoot.dispose()
            this.chartRoot = null
        }

        if (this.container.value !== null) {
            this.chartRoot = am5.Root.new(this.container.value)
            this.chartRoot.setThemes([
                am5themes_Dark.new(this.chartRoot)
            ])
            this.setup(this.chartRoot)
        }
        // else this.chartRoot remains null
    }
}