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
import {EntityLoaderV2} from "@/utils/loader/EntityLoaderV2";


export abstract class ChartController {

    public readonly container = ref<HTMLDivElement|null>(null)
    private chartRoot: am5.Root|null = null
    private readonly watchHandles: WatchStopHandle[] = []


    //
    // Public
    //

    public mount(): void {
        this.watchHandles.push(
            watch(this.container, this.containerDidChange, { immediate: true }),
            watch(this.loader.entity, this.dataDidChange, { immediate: true }),
        )
        this.loader.mount()
    }

    public unmount(): void {
        this.loader.unmount()
        for (const w of this.watchHandles) w()
        this.watchHandles.slice()
    }

    //
    // Protected (to be subclassed)
    //

    protected abstract setup(chartRoot: am5.Root): void

    protected abstract populate(data: object[]|null): void

    //
    // Protected (tools for subclasses)
    //

    protected constructor(readonly loader: EntityLoaderV2<object[]>) {}

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

    private readonly dataDidChange = () => {
        this.populate(this.loader.entity.value)
    }
}
