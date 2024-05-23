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

import {ref, shallowRef, watch, WatchStopHandle} from "vue";
import * as am5 from '@amcharts/amcharts5'
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark"
import axios from "axios";
import {MetricController} from "@/components/dashboard/primary/metric/MetricController";



export abstract class ChartController extends MetricController {

    public readonly container = ref<HTMLDivElement|null>(null)
    private readonly data= shallowRef<unknown[]|null>(null)
    private readonly loading = ref<boolean>(false)
    private readonly loadError = ref<unknown|null>(null)
    private watchHandle: WatchStopHandle|null = null
    private chartRoot: am5.Root|null = null

    //
    // MetricController
    //

    public mount() {
        super.mount()
        this.watchHandle = watch(this.container, this.containerDidChange, { immediate: true })
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
        this.data.value = null
        super.unmount()
    }

    protected async update(): Promise<void> {
        this.loading.value = true
        try {
            this.data.value = Object.preventExtensions(await this.loadData())
            this.loadError.value = null
        } catch(reason) {
            this.data.value = null
            this.loadError.value = reason
        } finally {
            this.loading.value = false
        }
        this.populate(this.data.value)
    }

    //
    // Protected (to be subclassed)
    //

    protected abstract setup(chartRoot: am5.Root): void

    protected abstract populate(data: unknown[]|null): void

    protected async loadData(): Promise<unknown[]> {
        throw "method must be subclassed"
    }

    //
    // Protected (tools for subclasses)
    //

    protected constructor(refreshPeriod: number) {
        super(refreshPeriod)
    }

    protected async loadDataFromGraphQL(query: string): Promise<unknown[]> {
        const url = "https://mainnet.hedera.api.hgraph.dev/v1/graphql"
        const response = await axios.post<GraphQLResponse>(url, { query })
        return Promise.resolve(response.data.data.all_metrics)
    }

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

interface GraphQLResponse {
    data: {
        all_metrics: unknown[]
    }
}
