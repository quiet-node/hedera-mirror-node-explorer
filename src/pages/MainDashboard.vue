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

  <div class="h-has-background-color is-flex is-justify-content-center h-mainnet-top-banner pt-1 pb-2">
    <DashboardItem :value="currentNetworkDisplayName"/>
  </div>

  <template v-if="isMainNetwork">
    <PrimaryDashboard/>
  </template>
  <template v-else>
    <SecondaryDashboard/>
  </template>

  <Footer/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, onBeforeUnmount, onMounted, watch} from 'vue';

import HbarMarketDashboard from "../components/dashboard/HbarMarketDashboard.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import CryptoTransactionTable from "@/components/dashboard/secondary/CryptoTransactionTable.vue";
import MessageTransactionTable from "@/components/dashboard/secondary/MessageTransactionTable.vue";
import ContractCallTransactionTable from "@/components/dashboard/secondary/ContractCallTransactionTable.vue";
import {TransactionType} from "@/schemas/HederaSchemas";
import Footer from "@/components/Footer.vue";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import {useRouter} from "vue-router";
import Chart from "@/components/chart/base/Chart.vue";
import HgraphChart from "@/components/chart/hgraph/HgraphChart.vue";
import {routeManager} from "@/router";
import {networkRegistry, NetworkRegistry} from "@/schemas/NetworkRegistry";
import SecondaryDashboard from "@/components/dashboard/secondary/SecondaryDashboard.vue";
import PrimaryDashboard from "@/components/dashboard/primary/PrimaryDashboard.vue";
import DashboardItem from "@/components/dashboard/DashboardItem.vue";

export default defineComponent({
  name: 'MainDashboard',

  components: {
    DashboardItem,
    PrimaryDashboard,
    SecondaryDashboard,
    HgraphChart,
    Chart,
    Footer,
    PlayPauseButton,
    DashboardCard,
    CryptoTransactionTable,
    MessageTransactionTable,
    ContractCallTransactionTable,
    HbarMarketDashboard,
  },

  props: {
    network: String
  },

  setup(props) {
    const isSmallScreen = inject('isSmallScreen', true)
    const isMediumScreen = inject('isMediumScreen', true)
    const isTouchDevice = inject('isTouchDevice', false)
    const displaySideBySide = inject('isLargeScreen', true)

    const router = useRouter()
    const pageSize = computed(() => isMediumScreen ? 5 : 6)

    const cryptoTableController = new TransactionTableController(
        router, pageSize, TransactionType.CRYPTOTRANSFER, "", "p1", "k1")

    const messageTableController = new TransactionTableController(
        router, pageSize, TransactionType.CONSENSUSSUBMITMESSAGE, "", "p2", "k2")

    const contractTableController = new TransactionTableController(
        router, pageSize, TransactionType.CONTRACTCALL, "", "p3", "k3")

    onMounted(() => {
      cryptoTableController.mount()
      messageTableController.mount()
      contractTableController.mount()
    })

    onBeforeUnmount(() => {
      cryptoTableController.unmount()
      messageTableController.unmount()
      contractTableController.unmount()
    })

    watch(() => props.network, () => {
      cryptoTableController.reset()
      messageTableController.reset()
      contractTableController.reset()
      cryptoTableController.startAutoRefresh()
      messageTableController.startAutoRefresh()
      contractTableController.startAutoRefresh()
    })

    const isMainNetwork
        = computed(() => routeManager.currentNetwork.value == NetworkRegistry.MAIN_NETWORK)

    const currentNetworkDisplayName = computed(() => {
      const currentNetwork = routeManager.currentNetwork.value
      const networkEntry = networkRegistry.lookup(currentNetwork)
      return networkEntry?.displayName ?? "?"
    })


    return {
      isSmallScreen,
      isTouchDevice,
      displaySideBySide,
      cryptoTableController,
      messageTableController,
      contractTableController,
      TransactionType,
      isMainNetwork,
      currentNetworkDisplayName
    }
  }

});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>