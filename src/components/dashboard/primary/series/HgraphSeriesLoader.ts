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

export abstract class HgraphSeriesLoader<E> extends EntityLoaderV2<E> {

    //
    // Protected (tools for subclasses)
    //

    protected async loadDataFromGraphQL(query: string): Promise<unknown[]> {
        const url = "https://mainnet.hedera.api.hgraph.dev/v1/graphql"
        const response = await axios.post<GraphQLResponse>(url, { query })
        return Promise.resolve(response.data.data.all_metrics)
    }

}

interface GraphQLResponse {
    data: {
        all_metrics: unknown[]
    }
}
