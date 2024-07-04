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
import {BoxAPI, UserProfile, UserRole, UserSession} from "@/utils/box/BoxAPI";
import {BoxManager} from "@/utils/box/BoxManager";

export class SignUpWizardState extends WizardState {


    //
    // Public
    //

    public emailAddress = "myemail@address.com"
    public verificationToken: string|null = null
    public verificationError: unknown = null
    public verificationCode = ""
    public confirmationResponse: UserSession|null = null
    public confirmationError: unknown = null
    public firstName = ""
    public lastName = ""
    public userProfileError: unknown = null
    public password1 = ""
    public password2 = ""
    public passwordError: unknown = null

    public inputEmailAddress(newValue: string): void {
        this.emailAddress = newValue
        this.verificationToken = null
        this.verificationError = null
        this.inputVerificationCode("")
    }

    public inputVerificationCode(newValue: string): void {
        this.verificationCode = newValue
        this.confirmationResponse = null
        this.confirmationError = null
        this.inputProfile(this.firstName, this.lastName) // It resets this.userProfileError to null
    }

    public inputProfile(firstName: string, lastName: string): void {
        this.firstName = firstName
        this.lastName = lastName
        this.userProfileError = null
        this.inputPassword("", "")
    }

    public inputPassword(password1: string, password2: string) {
        this.password1 = password1
        this.password2 = password2
        this.passwordError = null
    }

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
            case 3:
                result = this.isValidProfile()
                break
            case 4:
                result = this.isValidPassword()
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
            case 3:
                await this.updateUserProfile()
                result = this.userProfileError === null
                break
            case 4:
                await this.updatePassword()
                result = this.passwordError === null
                break
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
            const r = await BoxAPI.requestEmailVerification(this.emailAddress, false)
            this.verificationToken = r.verificationToken
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
            this.confirmationResponse = await BoxAPI.confirmEmailVerification(this.verificationToken!, this.verificationCode)
            this.confirmationError = null
            await BoxManager.instance.fetchSession()
        } catch(reason) {
            this.confirmationResponse = null
            this.confirmationError = reason
        }
    }

    //
    // Private (user profile)
    //

    private isValidProfile(): boolean {
        return true
    }

    private async updateUserProfile(): Promise<void> {
        const profile: UserProfile = {
            firstName: this.firstName,
            lastName: this.lastName,
            countryOfCitizenship: "FR",
            countryOfResidence: "FR",
            role: UserRole.developer
        }
        try {
            await BoxAPI.updateUserProfile(profile)
            this.userProfileError = null
        } catch(reason) {
            this.userProfileError = reason
        }
    }

    //
    // Private (password)
    //

    private isValidPassword(): boolean {
        return this.password1 == this.password2 && this.password1.length >= 2
    }

    private async updatePassword(): Promise<void> {
        try {
            await BoxAPI.updateUserPassword(this.password1)
            this.passwordError = null
        } catch(reason) {
            this.passwordError = reason
        }
    }
}
