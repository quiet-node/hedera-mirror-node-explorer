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
import {BoxAPI, UserSession} from "@/utils/box/BoxAPI";
import axios from "axios";

export class BoxManager {


    public static readonly instance = new BoxManager(import.meta.env.VITE_APP_BOX_URL_PREFIX ?? null)

    public readonly enabled: boolean
    private session = ref<UserSession|null>(null)
    private fetchCount = ref<number>(0)
    private fetchError = ref<unknown>(null)

    //
    // Public
    //

    public constructor(readonly boxURL: string|null) {
        this.enabled = boxURL != null
    }

    public async signIn(email: string, password: string): Promise<void> {
        if (this.enabled) {
            try {
                this.session.value = await BoxAPI.createUserSession(email, password)
            } catch(reason) {
                this.session.value = null
            }
        }
    }

    public async fetchSession(): Promise<void> {
        if (this.enabled) {
            try {
                this.session.value = await BoxAPI.fetchUserSession()
            } catch(reason) {
                this.session.value = null
            }
        }
        this.fetchCount.value += 1
    }

    public async destroySession(): Promise<void> {
        if (this.enabled) {
            try {
                await BoxAPI.destroyUserSession()
            } catch(reason) {
                if (!isUnauthorized(reason)) {
                    console.log("Failed to destroy session: " + reason)
                }
            } finally {
                this.session.value = null
            }
        }
    }

    public status = computed<BoxStatus>(() => {
        let result: BoxStatus
        if (this.enabled) {
            if (this.fetchError.value !== null) {
                result = BoxStatus.error
            } else if (this.fetchCount.value == 0) {
                result = BoxStatus.unknown
            } else {
                result = this.session.value !== null ? BoxStatus.connected : BoxStatus.disconnected
            }
        } else {
            result = BoxStatus.disconnected
        }
        return result
    })

    public emailAddress = computed(() => this.session.value?.user.email ?? null)
}

export enum BoxStatus {
    unknown,
    connected,
    disconnected,
    error
}

function isUnauthorized(reason: unknown): boolean {
    return axios.isAxiosError(reason) && reason.response?.status == 401
}
