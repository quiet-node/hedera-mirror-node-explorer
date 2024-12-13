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
  <div class="is-flex is-justify-content-space-between is-align-items-flex-end">

    <div class="is-inline-flex is-align-items-center is-flex-grow-0 is-flex-shrink-0 mr-3">
      <ProductLogo/>
      <AxiosStatus/>
    </div>

    <div class="is-flex-grow-0 is-flex-shrink-0 is-flex is-flex-direction-column ml-4">

      <TabBar/>

      <div id="navbar-grid">

        <div id="search-bar" :class="searchBarClass">
          <SearchBar/>
        </div>

        <div id="drop-down-menu">
          <NetworkSelector v-if="nbNetworks > 1"/>
        </div>

        <div v-if="enableWallet" id="connect-button">
          <ConnectWalletButton/>
        </div>

      </div>
    </div>

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {routeManager} from "@/router.ts";
import AxiosStatus from "@/components/AxiosStatus.vue";
import ConnectWalletButton from "@/components/wallet/ConnectWalletButton.vue";
import ProductLogo from "@/components/page/header/ProductLogo.vue";
import TabBar from "@/components/page/header/TabBar.vue";
import SearchBar from "@/components/page/header/SearchBar.vue";
import NetworkSelector from "@/components/page/header/NetworkSelector.vue";

const nbNetworks = routeManager.nbNetworks
const enableWallet = routeManager.enableWallet


const searchBarClass = computed(() => {
  let result: string
  if (routeManager.nbNetworks.value === 1 && !routeManager.enableWallet.value) {
    result = "search-bar-L"
  } else if (routeManager.nbNetworks.value === 1 || !routeManager.enableWallet.value) {
    result = "search-bar-M"
  } else {
    result = "search-bar-S"
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

#navbar-grid {
  position: relative;
  display: grid;
  column-gap: 1.2rem;
  grid-template-columns:repeat(20, minmax(0, 35px));
}

.search-bar-S {
  grid-column: span 12;
}

.search-bar-M {
  grid-column: span 16;
}

.search-bar-L {
  grid-column: span 20;
}

@media (max-width: 1449px) {
  #navbar-grid {
    grid-template-columns:repeat(17, minmax(0, 35px));
  }
}

@media (max-width: 1249px) {
  #navbar-grid {
    grid-template-columns:repeat(18, minmax(0, 24px));
  }
}

#drop-down-menu {
  grid-column: span 4;
}

@media (max-width: 1449px) {
  #drop-down-menu {
    grid-column: span 4;
  }
}

@media (max-width: 1249px) {
  #drop-down-menu {
    grid-column: span 5;
  }
}

#connect-button {
  grid-column: span 4;
}

@media (max-width: 1449px) {
  #connect-button {
    grid-column: span 4;
  }
}

@media (max-width: 1249px) {
  #connect-button {
    grid-column: span 5;
  }
}

</style>
