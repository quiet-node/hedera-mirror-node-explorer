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

import axios from "axios";
import {fetchBoolean, fetchString, fetchURL} from "@/config/ConfigUtils";
import {inject} from "vue";
import {coreConfigKey} from "@/AppKeys";


export class CoreConfig {

    public static FALLBACK = CoreConfig.parse({})

    //
    // Public
    //

    public static async load(url: string): Promise<CoreConfig> {
        let result: CoreConfig
        const response = await axios.get<unknown>(url)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            result = this.parse(response.data)
        } else {
            throw new Error("core-config.json is missing or cannot be decoded")
        }
        return result
    }

    public static inject(): CoreConfig {
        return inject<CoreConfig>(coreConfigKey, this.FALLBACK)
    }


    //
    // Private
    //

    private constructor(
        // When set to 'true', this variable will enable the 'Staking' page
        public readonly enableStaking: boolean,

        // The name of the product as shown in the footer tagline
        public readonly productName: string,

        // The prefix used in the document title
        public readonly documentTitleSuffix: string|null,

        // The content of meta tag: name="description"
        public readonly metaDescription: string|null,

        // The content of meta tag: property="og:url"
        public readonly metaURL: string|null,

        // The URL to which a click on the bottom-right sponsor logo will navigate
        public readonly sponsorURL: string|null,

        // The URL of the 'Terms of Use' page
        public readonly termsOfUseURL: string|null,

        // The HTML content of the disclaimer notice displayed on the Rewards Estimator
        public readonly estimatorNotice: string|null,

        // The HTML content of the disclaimer popup dialog displayed by the Wallet Chooser
        public readonly walletChooserDisclaimerPopup: string|null,

        // Global site tag ID for Google Analytics
        public readonly googleTagID: string|null,

        // The URL prefix of the IPFS gateway
        public readonly ipfsGatewayUrlPrefix: string

    ) {}


    private static parse(obj: object): CoreConfig {
        return new CoreConfig(
            fetchBoolean(obj, "enableStaking") ?? false,
            fetchString(obj, "productName") ??  "Hedera Mirror Node Explorer",
            fetchString(obj, "documentTitleSuffix"),
            fetchString(obj, "metaDescription"),
            fetchURL(obj, "metaURL"),
            fetchURL(obj, "sponsorURL"),
            fetchString(obj, "termsOfUseURL"),
            fetchString(obj, "estimatorNotice"),
            fetchString(obj, "walletChooserDisclaimerPopup"),
            fetchString(obj, "googleTagID"),
            fetchString(obj, "ipfsGatewayUrlPrefix") ?? "https://gateway.pinata.cloud/ipfs/"
        )
    }
}

