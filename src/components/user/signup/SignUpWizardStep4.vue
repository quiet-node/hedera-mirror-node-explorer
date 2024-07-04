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
    <div class="column is-one-quarter">Choose Password</div>
    <div class="column">
      <input class="input is-small has-text-white" type="password" v-model="password1"/>
    </div>
  </div>
  <div class="columns">
    <div class="column is-one-quarter">Confirm Password</div>
    <div class="column">
      <input class="input is-small has-text-white" type="password" v-model="password2"/>
    </div>
  </div>
  <div v-if="state.passwordError !== null">{{ state.passwordError }}</div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, ref, watch} from "vue";
import {SignUpWizardState} from "@/components/user/signup/SignUpWizardState";

const state = defineModel('state', { type: Object as PropType<SignUpWizardState>, required: true })

const password1 = ref<string>(state.value.password1)
watch(password1, () => {
  state.value.inputPassword(password1.value, password2.value)
})

const password2 = ref<string>(state.value.password2)
watch(password2, () => {
  state.value.inputPassword(password1.value, password2.value)
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
