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
      <span class="h-is-primary-title">Sign Up</span>
    </template>
    <template #wizardStep1>
      <SignUpWizardStep1 v-model:state="wizardState"/>
    </template>
    <template #wizardStep2>
      <SignUpWizardStep2 v-model:state="wizardState"/>
    </template>
    <template #wizardStep3>
      <SignUpWizardStep3 v-model:state="wizardState"/>
    </template>
    <template #wizardStep4>
      <SignUpWizardStep4 v-model:state="wizardState"/>
    </template>
    <template #wizardStep5>
      <SignUpWizardStep5 v-model:state="wizardState"/>
    </template>
  </Wizard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import Wizard from "@/components/dialog/wizard/Wizard.vue";
import SignUpWizardStep1 from "@/components/user/signup/SignUpWizardStep1.vue";
import SignUpWizardStep2 from "@/components/user/signup/SignUpWizardStep2.vue";
import SignUpWizardStep3 from "@/components/user/signup/SignUpWizardStep3.vue";
import {SignUpWizardState} from "@/components/user/signup/SignUpWizardState";
import {ref} from "vue";
import SignUpWizardStep4 from "@/components/user/signup/SignUpWizardStep4.vue";
import SignUpWizardStep5 from "@/components/user/signup/SignUpWizardStep5.vue";

//
// Props
//

const visible = defineModel('visible', { type: Boolean, default: true })
const wizardState = ref<SignUpWizardState>(new SignUpWizardState())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
