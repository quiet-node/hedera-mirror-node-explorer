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

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Nft, Nfts} from "@/schemas/HederaSchemas";
import {ComputedRef, Ref} from "vue";
import axios, {AxiosResponse} from "axios";
import {Router} from "vue-router";

export class NftAllowanceTableController extends TableController<Nft, string> {

    //
    // Public
    //

    public readonly accountId: Ref<string | null>

    public constructor(
        router: Router,
        accountId: Ref<string | null>,
        pageSize: ComputedRef<number>,
        pageParamName = "p",
        keyParamName = "k"
    ) {
        super(router, pageSize, 10 * pageSize.value, 5000, 0, 100,
            pageParamName, keyParamName);
        this.accountId = accountId
        this.watchAndReload([this.accountId])
    }

    //
    // TableController
    //

    public async load(
        key: string | null,
        operator: KeyOperator,
        order: SortOrder,
        limit: number
    ): Promise<Nft[] | null> {
        let result: Promise<Nft[] | null>

        if (this.accountId.value === null) {
            result = Promise.resolve(null)
        } else {
            const params = {} as {
                limit: number
                order: string
                "spender.id": string
                "token.id": string | undefined
                serialnumber: string | undefined
            }
            params.limit = limit
            params.order = order
            params["spender.id"] = KeyOperator.gte + ":0.0.1"   // a trick to get only the NFTs for which spender.id
                                                                // is not null (i.e the NFTs subject to an allowance)
            if (key !== null) {
                const items = key.split('-')
                const token = items[0] ?? null
                const serial = items[1] ?? null
                if (operator === KeyOperator.lt) {
                    params["token.id"] = token ? KeyOperator.lte + ":" + token : undefined
                    params.serialnumber = serial ? KeyOperator.lt + ":" + serial : undefined
                } else { // KeyOperator.gte
                    params["token.id"] = token ? KeyOperator.gte + ":" + token : undefined
                    params.serialnumber = serial ? KeyOperator.gte + ":" + serial : undefined
                }
            }
            const cb = (r: AxiosResponse<Nfts>): Promise<Nft[] | null> => {
                return Promise.resolve(r.data.nfts ?? [])
            }
            result = axios.get<Nfts>(
                "api/v1/accounts/" + this.accountId.value + "/nfts", {params: params})
                .then(cb)
        }

        return result
    }

    public keyFor(row: Nft): string {
        return row.token_id && row.serial_number ? `${row.token_id}-${row.serial_number}` : ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }
}
