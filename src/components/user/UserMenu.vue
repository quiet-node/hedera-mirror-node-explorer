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

  <div v-if="enabled" class="dropdown is-right is-last h-is-navbar-item h-is-dense" :class="{'is-active ': visible}">
    <div class="dropdown-trigger">
      <button class="button is-ghost" style="vertical-align: baseline" @click="pullDown" :disabled="unknown">
        <span class="icon is-small">
          <i v-if="unknown" class="fa fa-gear" aria-hidden="true"/>
          <i v-else-if="connected" class="fas fa-user" aria-hidden="true"/>
          <i v-else  class="fas fa-user-slash" aria-hidden="true"/>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu2" role="menu">
      <div v-if="connected" class="dropdown-content">
        <div class="dropdown-item has-text-grey">{{ emailAddress }}</div>
        <hr class="dropdown-divider" />
        <a href="#"  class="dropdown-item" @click="handleSignOff">Sign Off</a>
      </div>
      <div v-else class="dropdown-content">
        <a  href="#" class="dropdown-item" @click="handleSignUp">Sign Up</a>
        <hr class="dropdown-divider" />
        <a href="#"  class="dropdown-item" @click="handleSignIn">Sign In</a>
      </div>
    </div>
    <SignInWizard :visible="showSignInWizard"/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref} from "vue";
import {BoxManager, BoxStatus} from "@/utils/box/BoxManager";
import SignInWizard from "@/components/user/signin/SignInWizard.vue";

const enabled = BoxManager.instance.enabled
const unknown = computed(() => BoxManager.instance.status.value == BoxStatus.unknown)
const connected = computed(() => BoxManager.instance.status.value == BoxStatus.connected)
const emailAddress = BoxManager.instance.emailAddress

//
// pullDown
//
const visible = ref<boolean>(false)
const pullDown = () => {
  visible.value = !visible.value
}

//
// signUp
//
const showSignUpDialog = ref<boolean>(false)
const handleSignUp = () => {
  showSignUpDialog.value = true
  visible.value = false
}

//
// signIn
//

const showSignInWizard = ref<boolean>(false)
const handleSignIn = () => {
  showSignInWizard.value = true
  visible.value = false
}

//
// signOff
//

const handleSignOff = async () => {
  await BoxManager.instance.destroySession()
  visible.value = false
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>