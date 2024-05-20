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

import {computed, ref} from "vue";
import {HgraphMetricController} from "@/components/dashboard/primary/metric/HgraphMetricController";

export class TotalAccountController extends HgraphMetricController {

    private readonly count = ref(0)

    //
    // Public
    //

    public constructor() {
        super(24 * 3600 * 1000)
    }

    public countText = computed(() => {
        const v = this.count.value
        return v ? Number(v).toLocaleString('en-US') : ""
    })

    //
    // MetricController
    //

    protected async update(): Promise<void> {

        const query = "query TotalAccounts {" +
            "  total_accounts {" +
            "    count" +
            "    updated_at" +
            "  }" +
            "}"

        const data = await this.loadDataFromGraphQL(query) as {
            total_accounts: {
                count: number
                updated_at: string
            }[]
        }

        this.count.value = data.total_accounts[0].count
    }
}
