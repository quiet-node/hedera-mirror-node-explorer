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

import {XYChartController} from "@/components/chart/base/XYChartController";
import * as am5 from "@amcharts/amcharts5";

export class HgraphChartController extends XYChartController {

    //
    // Public
    //

    public constructor(readonly metricName: string) {
        super("end_date", "total")
    }

    //
    // XYChartController
    //

    protected setup(root: am5.Root) {
        super.setup(root)
        this.series!.data.processor = am5.DataProcessor.new(root, {
            dateFields: ["end_date"],
            dateFormat: "yyyy-MM-ddTHH:mm:ss"
        });
    }

    protected async loadData(): Promise<unknown[]> {
        const query = `query {
  all_metrics: ecosystem_metric(where: {
    name: { _eq: ${this.metricName} }
    period: { _eq: "day" }
  }) {
    end_date
    total
\t}
}`
        const records = await this.loadDataFromGraphQL(query)
        const result = this.removeNullEndDates(records)
        return Promise.resolve(result)
    }


    //
    // Private
    //

    private removeNullEndDates(records: unknown[]): unknown[] {
        const result: unknown[] =[]
        for (const r of records) {
            if ((r as Metric).end_date !== null) {
                result.push(r)
            }
        }
        return result
    }
}

interface Metric {
    end_date: string
    total: number
}
