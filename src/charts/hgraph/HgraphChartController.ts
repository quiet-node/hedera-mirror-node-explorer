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

import {
    ChartController,
    ChartGranularity,
    ChartRange,
    computeGranularityForRange
} from "@/charts/core/ChartController.ts";
import {aggregateMetrics, EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import axios from "axios";

export abstract class HgraphChartController extends ChartController<EcosystemMetric> {

    //
    // Protected (to be subclassed)
    //

    protected abstract makeQuery(range: ChartRange): string


    //
    // ChartController
    //

    public isSupported(): boolean {
        return this.getHgraphURL() !== null
    }

    protected transformMetrics(metrics: EcosystemMetric[], range: ChartRange): EcosystemMetric[] {
        return aggregateMetrics(metrics, computeGranularityForRange(range))
    }

    protected async loadData(range: ChartRange): Promise<EcosystemMetric[]> {
        let result: EcosystemMetric[]

        const url = this.getHgraphURL()
        if (url !== null) {
            const query = this.makeQuery(range)
            const response = await axios.post<GraphQLResponse>(url, { query })
            result = response.data.data.all_metrics
        } else {
            result = []
        }

        return Promise.resolve(result)
    }

    //
    // Protected (for subclasses)
    //

    private getHgraphURL(): string|null {
        let result: string|null
        const hgraphKey = this.routeManager.hgraphKey
        switch(this.routeManager.currentNetworkEntry.value.mirrorNodeURL) {
            case "https://mainnet-public.mirrornode.hedera.com/":
            case "https://mainnet.mirrornode.hedera.com/":
                result = hgraphKey !== null
                    ? "https://mainnet.hedera.api.hgraph.io/v1/graphql"
                    : "https://mainnet.hedera.api.hgraph.dev/v1/graphql"
                break
            case "https://testnet.mirrornode.hedera.com/":
                result = hgraphKey !== null
                    ? "https://testnet.hedera.api.hgraph.io/v1/graphql"
                    : "https://testnet.hedera.api.hgraph.dev/v1/graphql"
                break
            default:
                result = null
                break
        }
        return result
    }

}

interface GraphQLResponse {
    data: {
        all_metrics: EcosystemMetric[]
    }
}

export function makeGraphLabels(metrics: EcosystemMetric[], granularity: ChartGranularity): string[] {
    const result: string[] = []
    for (const m of metrics) {
        const t = Date.parse(m.start_date)
        if (isNaN(t)) {
            result.push(m.start_date)
        } else {
            switch (granularity) {
                case ChartGranularity.hour:
                    result.push(hourFormat.format(t))
                    break
                case ChartGranularity.day:
                    result.push(dayFormat.format(t))
                    break
                case ChartGranularity.month:
                    result.push(monthFormat.format(t))
                    break
                case ChartGranularity.year:
                    result.push(yearFormat.format(t))
                    break
            }
        }
    }
    return result
}

const hourFormat = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    weekday: "short"
})

const dayFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
})

const monthFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
})

const yearFormat = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
})
