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
  <div class="columns">
    <div class="column is-one-quarter">Verification Code</div>
    <div class="column">
      <input class="input is-small has-text-white" type="email" v-model="verificationCode"/>
      <template v-if="state.confirmationError !== null">{{ state.confirmationError }}</template>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, ref, watch} from "vue";
import {SignInWizardState} from "@/components/user/signin/SignInWizardState";

const state = defineModel('state', { type: Object as PropType<SignInWizardState>, required: true })

const verificationCode = ref<string>(state.value.verificationCode)
watch(verificationCode, () => {
  state.value.inputVerificationCode(verificationCode.value)
})


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>