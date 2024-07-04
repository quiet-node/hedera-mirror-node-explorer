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

export class BoxAPI {

    private static readonly boxURL = import.meta.env.VITE_APP_BOX_URL_PREFIX ?? ""

    private static readonly privateAxios = axios.create({
        baseURL: this.boxURL,  // + "/api"
        withCredentials: true,
    })


    //
    // User
    //

    public static async requestEmailVerification(email: string, passwordReset: boolean): Promise<EmailVerificationResponse> {
        const url = "/user"
        const request = {
            email,
            options: { passwordReset }
        }
        return (await this.privateAxios.post<EmailVerificationResponse>(url, request)).data
    }

    public static async confirmEmailVerification(token: string, pin: string): Promise<UserSession> {
        const url = "/user/me/verification"
        const request = { token, pin}
        return (await this.privateAxios.post<UserSession>(url, request)).data
    }

    public static async updateUserPassword(password: string): Promise<void> {
        const url = "/user/me/password"
        const request = { password }
        await this.privateAxios.put<UserSession>(url, request)
    }

    public static async updateUserProfile(profile: UserProfile): Promise<void> {
        const url = "/user/me"
        await this.privateAxios.put<UserSession>(url, profile)
    }

    //
    // Session
    //

    public static async createUserSession(email: string, password: string): Promise<UserSession> {
        const url = "/session"
        const recaptchaToken = "dummy"
        const request = { email, password, recaptchaToken }
        return (await this.privateAxios.post<UserSession>(url, request)).data
    }

    public static async fetchUserSession(): Promise<UserSession> {
        const url = "/session/current"
        return (await this.privateAxios.get<UserSession>(url)).data
    }

    public static async destroyUserSession(): Promise<void> {
        const url = "/session/current"
        await this.privateAxios.delete<UserSession>(url)
    }
}


export interface EmailVerificationResponse {
    verificationToken: string
}

export interface User {
    userId: string
    email: string
    profile?: UserProfile
}

export interface UserProfile {
    firstName: string
    lastName: string
    countryOfResidence: string
    countryOfCitizenship: string
    role: UserRole
}

export enum UserRole {
    developer = "developer",
    partner = "partner",
    councilMember = "council_member",
}

export interface UserSession {
    user: User
}
