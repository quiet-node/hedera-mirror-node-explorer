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
    <div class="column is-one-quarter">First Name</div>
    <div class="column">
      <input class="input is-small has-text-white" v-model="firstName"/>
    </div>
  </div>
  <div class="columns">
    <div class="column is-one-quarter">Last Name</div>
    <div class="column">
      <input class="input is-small has-text-white" v-model="lastName"/>
    </div>
  </div>
  <div v-if="state.userProfileError !== null">{{ state.confirmationError }}</div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, ref, watch} from "vue";
import {SignInWizardState} from "@/components/user/signin/SignInWizardState";

const state = defineModel('state', { type: Object as PropType<SignInWizardState>, required: true })

const firstName = ref<string>(state.value.firstName)
watch(firstName, () => {
  state.value.inputProfile(firstName.value, lastName.value)
})

const lastName = ref<string>(state.value.lastName)
watch(lastName, () => {
  state.value.inputProfile(firstName.value, lastName.value)
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>