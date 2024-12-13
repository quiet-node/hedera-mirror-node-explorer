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
  <router-link :to="routeManager.makeRouteToMainDashboard()">
    <img v-if="productLogoURL" id="product-logo" alt="Product Logo" class="image" :src="productLogoURL">
    <img v-else id="product-logo" alt="Product Logo" class="image" src="@/assets/branding/brand-product-logo.png">
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {routeManager} from "@/router.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";

const coreConfig = CoreConfig.inject()
const productLogoURL = coreConfig.productLogoURL

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

#product-logo {
  max-width: 242px;
  max-height: 72px;
  width: 100%
}

@media (max-width: 1449px) {
  #product-logo {
    max-width: 220px;
  }
}

</style>
