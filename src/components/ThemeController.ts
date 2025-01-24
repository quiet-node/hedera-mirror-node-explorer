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

import {computed, inject, ref, watch} from "vue";
import {AppStorage} from "@/AppStorage.ts";
import {themeControllerKey} from "@/AppKeys.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";

export class ThemeController {

    public readonly coreConfig: CoreConfig
    public readonly darkSelected = ref(false)

    //
    // Public
    //

    public constructor(coreConfig: CoreConfig) {
        this.coreConfig = coreConfig
    }

    public mount(): void {
        this.darkSelected.value = AppStorage.getTheme() === 'dark'
        watch(this.darkSelected, this.darkSelectedDidChange, {immediate: true})
    }

    public productLogoURL = computed(() => {
        return this.darkSelected.value
            ? this.coreConfig.productLogoDarkURL
            : this.coreConfig.productLogoLightURL
    })

    public static inject(): ThemeController {
        const defaultFactory = () => {
            const result = new ThemeController(CoreConfig.FALLBACK)
            result.mount()
            return result
        }
        return inject<ThemeController>(themeControllerKey, defaultFactory, true)
    }

    //
    // Private
    //

    private darkSelectedDidChange = () => {
        if (this.darkSelected.value) {
            AppStorage.setTheme('dark')
            document.documentElement.style.setProperty('--network-button-color', 'var(--dark-network-button-color)')
            document.documentElement.style.setProperty('--network-chip-color', 'var(--dark-network-chip-color)')
            document.documentElement.style.setProperty('--network-text-accent-color', 'var(--dark-network-text-accent-color)')
            document.documentElement.style.setProperty('--network-border-accent-color', 'var(--dark-network-border-accent-color)')

            document.documentElement.style.setProperty('--text-primary', 'var(--dark-text-primary)')
            document.documentElement.style.setProperty('--text-secondary', 'var(--dark-text-secondary)')
            document.documentElement.style.setProperty('--text-accent', 'var(--network-text-accent-color)')
            document.documentElement.style.setProperty('--text-accent2', 'var(--dark-text-accent2)')
            document.documentElement.style.setProperty('--text-success', 'var(--dark-text-success)')
            document.documentElement.style.setProperty('--text-error', 'var(--dark-text-error)')
            document.documentElement.style.setProperty('--text-disabled', 'var(--dark-text-disabled)')
            document.documentElement.style.setProperty('--background-primary', 'var(--dark-background-primary)')
            document.documentElement.style.setProperty('--background-secondary', 'var(--dark-background-secondary)')
            document.documentElement.style.setProperty('--background-tertiary', 'var(--dark-background-tertiary)')
            document.documentElement.style.setProperty('--border-secondary', 'var(--dark-border-secondary)')
            document.documentElement.style.setProperty('--table-border', 'var(--dark-table-border)')
            document.documentElement.style.setProperty('--chip-primary', 'var(--network-chip-color)')
            document.documentElement.style.setProperty('--chip-text-primary', 'var(--dark-chip-text-primary)')
            document.documentElement.style.setProperty('--button-text-primary', 'var(--dark-button-text-primary)')
            document.documentElement.style.setProperty('--button-text-secondary', 'var(--dark-button-text-secondary)')
            document.documentElement.style.setProperty('--button-background-primary', 'var(--network-button-color)')
            document.documentElement.style.setProperty('--button-background-secondary', 'var(--dark-button-background-secondary)')
            document.documentElement.style.setProperty('--tab-background', 'var(--dark-tab-background)')
            document.documentElement.style.setProperty('--icon-default-color', 'var(--dark-icon-default-color)')
            document.documentElement.style.setProperty('--status-success-color', 'var(--dark-status-success-color)')
            document.documentElement.style.setProperty('--status-error-color', 'var(--dark-status-error-color)')
            document.getElementById('product-logo')?.setAttribute('src', this.coreConfig.productLogoDarkURL ?? '')
            document.getElementById('sponsor-logo')?.setAttribute('src', this.coreConfig.sponsorLogoDarkURL ?? '')
            document.getElementById('built-on-logo')?.setAttribute('src', this.coreConfig.builtOnLogoDarkURL ?? '')
        } else {
            AppStorage.setTheme('light')
            document.documentElement.style.setProperty('--network-button-color', 'var(--light-network-button-color)')
            document.documentElement.style.setProperty('--network-chip-color', 'var(--light-network-chip-color)')
            document.documentElement.style.setProperty('--network-text-accent-color', 'var(--light-network-text-accent-color)')
            document.documentElement.style.setProperty('--network-border-accent-color', 'var(--light-network-border-accent-color)')

            document.documentElement.style.setProperty('--text-primary', 'var(--light-text-primary)')
            document.documentElement.style.setProperty('--text-secondary', 'var(--light-text-secondary)')
            document.documentElement.style.setProperty('--text-accent', 'var(--network-text-accent-color)')
            document.documentElement.style.setProperty('--text-accent2', 'var(--light-text-accent2)')
            document.documentElement.style.setProperty('--text-success', 'var(--light-text-success)')
            document.documentElement.style.setProperty('--text-error', 'var(--light-text-error)')
            document.documentElement.style.setProperty('--text-disabled', 'var(--light-text-disabled)')
            document.documentElement.style.setProperty('--background-primary', 'var(--light-background-primary)')
            document.documentElement.style.setProperty('--background-secondary', 'var(--light-background-secondary)')
            document.documentElement.style.setProperty('--background-tertiary', 'var(--light-background-tertiary)')
            document.documentElement.style.setProperty('--border-secondary', 'var(--light-border-secondary)')
            document.documentElement.style.setProperty('--table-border', 'var(--light-table-border)')
            document.documentElement.style.setProperty('--chip-primary', 'var(--network-chip-color)')
            document.documentElement.style.setProperty('--chip-text-primary', 'var(--light-chip-text-primary)')
            document.documentElement.style.setProperty('--button-text-primary', 'var(--light-button-text-primary)')
            document.documentElement.style.setProperty('--button-text-secondary', 'var(--light-button-text-secondary)')
            document.documentElement.style.setProperty('--button-background-primary', 'var(--network-button-color)')
            document.documentElement.style.setProperty('--button-background-secondary', 'var(--light-button-background-secondary)')
            document.documentElement.style.setProperty('--tab-background', 'var(--light-tab-background)')
            document.documentElement.style.setProperty('--icon-default-color', 'var(--light-icon-default-color)')
            document.documentElement.style.setProperty('--status-success-color', 'var(--light-status-success-color)')
            document.documentElement.style.setProperty('--status-error-color', 'var(--light-status-error-color)')
            document.getElementById('product-logo')?.setAttribute('src', this.coreConfig.productLogoLightURL ?? '')
            document.getElementById('sponsor-logo')?.setAttribute('src', this.coreConfig.sponsorLogoLightURL ?? '')
            document.getElementById('built-on-logo')?.setAttribute('src', this.coreConfig.builtOnLogoLightURL ?? '')
        }
    }
}
