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


import {WizardState} from "@/components/dialog/wizard/WizardState";
import axios from "axios";

export class SignInWizardState extends WizardState {


    //
    // Public
    //

    public emailAddress = "myemail@address.com"
    public verificationToken: string|null = null
    public verificationError: unknown = null
    public verificationCode = ""
    public confirmationResponse: EmailConfirmationResponse|null = null
    public confirmationError: unknown = null

    private readonly privateAxios = axios.create({
        // baseURL: "/api",
        withCredentials: true,
    })

    //
    // WizardState
    //

    public backEnabled(/* currentStep: number */): boolean {
        return true
    }

    public nextEnabled(currentStep: number): boolean {
        let result: boolean
        switch(currentStep) {
            case 1:
                result = this.isValidEmailAddress()
                break
            case 2:
                result = this.isValidEmailAddress() && this.isValidVerificationCode()
                break
            default:
                result = false
                break
        }
        return result
    }

    public async moveToNext(currentStep: number): Promise<boolean> {
        let result: boolean
        switch(currentStep) {
            case 1:
                await this.requestEmailVerification()
                result = this.verificationToken !== null
                break
            case 2:
                await this.confirmEmailVerification()
                result = this.confirmationResponse !== null
                break;
            default:
                result = false
                break
        }
        return Promise.resolve(result)
    }

    //
    // Private (email address)
    //

    private isValidEmailAddress(): boolean {
        let count = 0
        for (const c of this.emailAddress) {
            if (c == "@") {
                count += 1
            }
        }
        return count == 1
    }

    private async requestEmailVerification(): Promise<void> {
        try {
            const url = "http://localhost:3000/user"
            const request = {
                "email": this.emailAddress
            }
            const r = await this.privateAxios.post<EmailVerificationResponse>(url, request)
            this.verificationToken = r.data.verificationToken
            this.verificationError = null
        } catch(reason) {
            console.log("Email verification failed: " + reason)
            this.verificationToken = null
            this.verificationError = reason
        }
    }

    //
    // Private (verification code)
    //

    private isValidVerificationCode(): boolean {
        return this.verificationCode != ""
    }

    private async confirmEmailVerification(): Promise<void> {
        try {
            const url = "http://localhost:3000/user/me/verification"
            const request = {
                token: this.verificationToken!,
                pin: this.verificationCode
            }
            const r = await this.privateAxios.post<EmailConfirmationResponse>(url, request)
            this.confirmationResponse = r.data
            this.confirmationError = null
        } catch(reason) {
            this.confirmationResponse = null
            this.confirmationError = reason
        }
    }
}

interface EmailVerificationResponse {
    verificationToken: string
}

interface EmailConfirmationResponse {
    user: {
        userId: string,
        email: string,
        profile: object
    }
}