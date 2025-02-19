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

import {ChartConfiguration} from "chart.js";
import {ChartRange, computeGranularityForRange, computeStartDateForRange,} from "@/charts/core/ChartController.ts";
import {HgraphChartController, makeGraphLabels} from "@/charts/hgraph/HgraphChartController.ts";
import {averageMetrics, EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";

export class TPSController extends HgraphChartController {

    //
    // Public
    //

    public constructor(themeController: ThemeController, routeManager: RouteManager) {
        super("TPS", themeController, routeManager, [ChartRange.year, ChartRange.day, ChartRange.all])
    }

    //
    // HgraphChartController
    //

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected makeQuery(range: ChartRange): string {
        const periodStartDate = computeStartDateForRange(range)
        return "{" +
            "  all_metrics: ecosystem_metric(" +
            "    where: {" +
            "      name: {_eq: \"network_tps\"}, " +
            "      period: {_eq: \"hour\"}," +
            "      start_date: {_gte: \"" + periodStartDate + "\"}," +
            "    }" +
            "    order_by: {start_date: asc}" +
            "  ) {" +
            "    start_date" +
            "    end_date" +
            "    total" +
            "  }" +
            "}"
    }

    protected makeLatestQuery(): string {
        return "{" +
            "  all_metrics: ecosystem_metric(" +
            "    where: {" +
            "      name: {_eq: \"network_tps\"}, " +
            "      period: {_eq: \"hour\"}" +
            "    }" +
            "    order_by: {start_date: desc}" +
            "    limit: 1" +
            "  ) {" +
            "    start_date" +
            "    end_date" +
            "    total" +
            "  }" +
            "}"
    }

    protected transformMetrics(metrics: EcosystemMetric[], range: ChartRange): EcosystemMetric[] {
        const granularity = computeGranularityForRange(range)
        return averageMetrics(metrics, granularity)
    }

    protected makeChartConfig(metrics: EcosystemMetric[], range: ChartRange): ChartConfiguration {
        const granularity = computeGranularityForRange(range)
        const graphLabels = makeGraphLabels(metrics, granularity)
        const graphDataSet = this.makeGraphDataSet(metrics) as any
        const textPrimaryColor = this.themeController.getTextPrimaryColor()

        return  {
            type: 'bar',
            data: {
                labels: graphLabels,
                datasets: [graphDataSet],
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: "logarithmic",
                        ticks: {
                            autoSkip: true,
                            autoSkipPadding: 20,
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                maintainAspectRatio: false
            }
        }
    }

    //
    // Private
    //

    private makeGraphDataSet(metrics: EcosystemMetric[]): object {
        const totals = metrics.map((metric) => metric.total)
        const graphBarColor = this.themeController.getGraphBarColor()
        return {
            label: "TPS",
            data: totals,
            borderWidth: 1,
            backgroundColor: graphBarColor
        }
    }
}
