<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Wizard :state="wizardState" :visible="visible">
    <template #wizardTitle>
      <span class="h-is-primary-title">Sign In</span>
    </template>
    <template #wizardStep1>
      <SignInWizardStep1 v-model:state="wizardState"/>
    </template>
    <template #wizardStep2>
      <SignInWizardStep2 v-model:state="wizardState"/>
    </template>
    <template #wizardStep3>
      <SignInWizardStep3 v-model:state="wizardState"/>
    </template>
  </Wizard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import Wizard from "@/components/dialog/wizard/Wizard.vue";
import SignInWizardStep1 from "@/components/user/signin/SignInWizardStep1.vue";
import SignInWizardStep2 from "@/components/user/signin/SignInWizardStep2.vue";
import SignInWizardStep3 from "@/components/user/signin/SignInWizardStep3.vue";
import {SignInWizardState} from "@/components/user/signin/SignInWizardState";
import {ref} from "vue";

//
// Props
//

const visible = defineModel('visible', { type: Boolean, default: true })
const wizardState = ref<SignInWizardState>(new SignInWizardState())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
