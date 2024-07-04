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
    <div class="column is-one-quarter">e-mail Address</div>
    <div class="column">
      <input class="input is-small has-text-white" type="email" v-model="emailAddress"/>
      <template v-if="state.verificationError !== null" class="is-small">{{ state.verificationError }}</template>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {SignUpWizardState} from "@/components/user/signup/SignUpWizardState";
import {PropType, ref, watch} from "vue";

const state = defineModel('state', { type: Object as PropType<SignUpWizardState>, required: true })

const emailAddress = ref<string>(state.value.emailAddress)
watch(emailAddress, () => {
  state.value.inputEmailAddress(emailAddress.value)
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>