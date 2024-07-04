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
  <Dialog :controller="controller">
    <template #dialogTitle>Sign In</template>
    <template #dialogInput>
      <div class="columns">
        <div class="column is-one-quarter">e-mail</div>
        <div class="column">
          <input class="input is-small has-text-white" v-model="emailAddress"/>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">Password</div>
        <div class="column">
          <input class="input is-small has-text-white" type="password" v-model="password"/>
        </div>
      </div>
    </template>
    <template #dialogInputButtons>
      <DialogButton :controller="controller">Cancel</DialogButton>
      <DialogButton :controller="controller" :auto-close="false" :enabled="signInEnabled" @action="handleSignIn">Sign In</DialogButton>
    </template>
  </Dialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import Dialog from "@/components/dialog/Dialog.vue";
import {DialogController} from "@/components/dialog/DialogController";
import DialogButton from "@/components/dialog/DialogButton.vue";
import {computed, ref} from "vue";
import {BoxManager} from "@/utils/box/BoxManager";

//
// Props
//

const visible = defineModel('visible', { type: Boolean, default: true })
const controller = new DialogController(visible)

//
// email and password
//

const emailAddress = ref<string>("")
const password = ref<string>("")


//
// handleSignIn
//

const signInEnabled = computed(() => {
  return emailAddress.value.indexOf("@") != -1 && password.value.length >= 1
})

const handleSignIn = () => {
  BoxManager.instance.signIn(emailAddress.value, password.value)
  visible.value = false
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>

