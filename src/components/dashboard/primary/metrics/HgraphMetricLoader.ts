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

import {EntityLoaderV2} from "@/utils/loader/EntityLoaderV2";
import axios from "axios";
import {computed} from "vue";

export abstract class HgraphMetricLoader extends EntityLoaderV2<number> {

    //
    // Public
    //

    public constructor() {
        super(24 * 3600 * 1000, EntityLoaderV2.HUGE_COUNT)
    }

    public countText = computed(() => {
        const v = this.entity.value
        return v ? Number(v).toLocaleString('en-US') : ""
    })

    //
    // Protected (tool for subclasses)
    //

    protected async loadDataFromGraphQL(query: string): Promise<object> {
        const url = "https://mainnet.hedera.api.hgraph.dev/v1/graphql"
        const response = await axios.post<GraphQLResponse>(url, { query })
        return Promise.resolve(response.data.data)
    }

}

interface GraphQLResponse {
    data: object
}


export class TotalAccountLoader extends HgraphMetricLoader {


    //
    // EntityCache
    //

    protected async load(): Promise<number> {

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

        return Promise.resolve(data.total_accounts[0].count)
    }

}


export class TotalTransactionLoader extends HgraphMetricLoader {

    //
    // EntityCache
    //

    protected async load(): Promise<number> {

        const query = "query TotalTransactions {" +
            "  total_transactions: ecosystem_metric_aggregate(" +
            "    where: {" +
            "      start_date: {_gte: \"1970-01-01\", _lt: \"2030-01-01\"}, " +
            "      name: {_eq: \"transactions\"}" +
            "    }) " +
            "    {" +
            "    aggregate {" +
            "      sum {" +
            "        total" +
            "      }" +
            "    }" +
            "  }" +
            "}"

        const data = await this.loadDataFromGraphQL(query) as {
            total_transactions: {
                aggregate: {
                    sum: {
                        total: number
                    }
                }
            }
        }


        return Promise.resolve(data.total_transactions.aggregate.sum.total)
    }

}
