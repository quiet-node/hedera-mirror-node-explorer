<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2023 Hedera Hashgraph, LLC
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
  <div class="is-flex mb-3 is-align-items-baseline is-justify-content-space-between">
    <NavMenuItem :tabId="TabId.Dashboard" :is-first="true"
                 :target-route="routeManager.makeRouteToMainDashboard()"/>
    <NavMenuItem :tabId="TabId.Transactions"
                 :target-route="routeManager.makeRouteToTransactions()"/>
    <NavMenuItem :tabId="TabId.Tokens"
                 :target-route="routeManager.makeRouteToTokens()"/>
    <NavMenuItem :tabId="TabId.Topics"
                 :target-route="routeManager.makeRouteToTopics()"/>
    <NavMenuItem :tabId="TabId.Contracts"
                 :target-route="routeManager.makeRouteToContracts()"/>
    <NavMenuItem :tabId="TabId.Accounts"
                 :target-route="routeManager.makeRouteToAccounts()"/>
    <NavMenuItem :tabId="TabId.Nodes"
                 :target-route="routeManager.makeRouteToNodes()"/>
    <NavMenuItem v-if="enableStaking"
                 :tabId="TabId.Staking"
                 :target-route="routeManager.makeRouteToStaking()"/>
    <NavMenuItem :tabId="TabId.Blocks"
                 :target-route="routeManager.makeRouteToBlocks()"/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {TabId} from "@/utils/RouteManager.ts";
import {routeManager} from "@/router.ts";
import NavMenuItem from "@/components/page/NavMenuItem.vue";

const enableStaking = routeManager.enableStaking

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
