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

import {MetricController} from "@/components/dashboard/primary/metric/MetricController";
import {NetworkExchangeRateSetResponse, NetworkSupplyResponse} from "@/schemas/HederaSchemas";
import {computed, ref} from "vue";
import axios from "axios";

export class HbarMarketController extends MetricController {

    private readonly lastExchangeRate = ref<NetworkExchangeRateSetResponse|null>(null)
    private readonly lastExchangeRate24 = ref<NetworkExchangeRateSetResponse|null>(null)
    private readonly lastSupply = ref<NetworkSupplyResponse|null>(null)
    private readonly lastSupply24 = ref<NetworkSupplyResponse|null>(null)

    //
    // Public
    //

    public readonly hbarPriceText = computed(() => {
        const v = this.hbarPrice.value
        return v ? "$" + v.toFixed(4) : ""
    })

    public readonly hbarPriceVariationText = computed(() => {
        const v = this.hbarPriceVariation.value
        return v ? v.toFixed(2) : ""
    })

    public readonly hbarReleasedText = computed(() => {
        const v = this.hbarReleased.value
        return v ? Number(v).toLocaleString('en-US') : ""
    })

    public readonly hbarTotalText = computed(() => {
        const v = this.hbarTotal.value
        return v ? Number(v).toLocaleString('en-US') : ""
    })

    public readonly hbarMarketCapText = computed(() => {
        const v = this.hbarMarketCap.value
        const result = v !== null ? Number(v).toLocaleString("en-US") : ""
        return result
    })

    public readonly hbarMarketCapVariationText = computed(() => {
        const v = this.hbarMarketCapVariation.value
        return v !== null ? Number(v).toFixed(2) : ""
    })


    //
    // MetricController
    //

    protected async update(): Promise<void> {

        const dateNow = new Date()
        const date24 = new Date(dateNow.getTime() - 24 * 3600 * 1000)
        const paramsNow = { timestamp: dateNow.getTime() / 1000 }
        const params24 = { timestamp: date24.getTime() / 1000 }
        this.lastExchangeRate.value = (await axios.get<NetworkExchangeRateSetResponse>(
            "api/v1/network/exchangerate", { params: paramsNow})).data
        this.lastExchangeRate24.value = (await axios.get<NetworkExchangeRateSetResponse>(
            "api/v1/network/exchangerate", {params: params24})).data
        this.lastSupply.value = (await axios.get<NetworkSupplyResponse>(
            "api/v1/network/supply", { params: paramsNow})).data
        this.lastSupply24.value = (await axios.get<NetworkSupplyResponse>(
            "api/v1/network/supply", {params: params24})).data

    }

    //
    // Private
    //


    private readonly hbarPrice = computed(() => {
        const rate = this.lastExchangeRate.value?.current_rate
        return rate ? (Math.round(rate.cent_equivalent / rate.hbar_equivalent * 100) / 10000) : null
    })

    private readonly hbarPrice24 = computed(() => {
        const rate = this.lastExchangeRate24.value?.current_rate
        return rate ? (Math.round(rate.cent_equivalent / rate.hbar_equivalent * 100) / 10000) : null
    })

    private readonly hbarPriceVariation = computed(() => {
        const currentPrice = this.hbarPrice.value
        const price24h = this.hbarPrice24.value
        return (currentPrice && price24h)
            ? (Math.round((currentPrice - price24h) / price24h * 10000) / 100)
            : null
    })

    private readonly hbarReleased = computed(() => {
        const released = Number(this.lastSupply.value?.released_supply)
        return released ? released / 100000000 : null
    })

    private readonly hbarReleased24 = computed(() => {
        const released = Number(this.lastSupply24.value?.released_supply)
        return released ? released / 100000000 : null
    })

    private readonly hbarTotal = computed(() => {
        const total = Number(this.lastSupply.value?.total_supply)
        return total ? total / 100000000 : null
    })

    private readonly hbarMarketCap = computed(() => {
        const released = this.hbarReleased.value
        const price = this.hbarPrice.value
        return (released && price)
            ? Math.round(released * price)
            : null
    })

    public readonly hbarMarketCapVariation = computed(() => {
        let result: string|null
        const released = this.hbarReleased.value
        const price = this.hbarPrice.value
        const released24h = this.hbarReleased24.value
        const price24h = this.hbarPrice24.value
        if (released && price && released24h && price24h) {
            const variation = (released * price - released24h * price24h) / (released24h * price24h)
            result = (Math.round(variation * 10000) / 100).toFixed(2)
        } else {
            result = null
        }
        return result
    })

}