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
  <section class="section" :class="{'h-mobile-background': isTouchDevice || !isSmallScreen}">


    <div class="columns">

      <div class="column">
        <DashboardCard data-cy="cryptoTransfers">
          <template v-slot:title>
            <span class="h-is-secondary-title">Crypto Transfers</span>
          </template>
          <template v-slot:control>
            <PlayPauseButton v-bind:controller="cryptoTableController"/>
          </template>
          <template v-slot:content>
            <CryptoTransactionTable v-bind:controller="cryptoTableController"/>
          </template>
        </DashboardCard>
      </div>

    </div>


    <div class="columns is-multiline">

          <div class="column" :class="{'is-full': !isXLargeScreen}">
            <DashboardCard data-cy="smartContractCalls">
              <template v-slot:title>
                <span class="h-is-secondary-title">Smart Contract Calls</span>
              </template>
              <template v-slot:control>
                <PlayPauseButton v-bind:controller="contractTableController"/>
              </template>
              <template v-slot:content>
                <ContractCallTransactionTable v-bind:controller="contractTableController"/>
              </template>
            </DashboardCard>
          </div>

          <div class="column">
            <DashboardCard data-cy="hcsMessages">
              <template v-slot:title>
                <span class="h-is-secondary-title">HCS Messages</span>
              </template>
              <template v-slot:control>
                <PlayPauseButton v-bind:controller="messageTableController"/>
              </template>
              <template v-slot:content>
                <MessageTransactionTable v-bind:controller="messageTableController"/>
              </template>
            </DashboardCard>
          </div>

        </div>

  </section>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, onBeforeUnmount, onMounted, watch} from "vue";
import MessageTransactionTable from "@/components/dashboard/secondary/MessageTransactionTable.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import ContractCallTransactionTable from "@/components/dashboard/secondary/ContractCallTransactionTable.vue";
import {useRouter} from "vue-router";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import {TransactionType} from "@/schemas/HederaSchemas";
import {routeManager} from "@/router";
import {networkRegistry, NetworkRegistry} from "@/schemas/NetworkRegistry";
import CryptoTransactionTable from "@/components/dashboard/secondary/CryptoTransactionTable.vue";

export default defineComponent({
  name: 'SecondaryDashboard',

  components: {
    CryptoTransactionTable,
    ContractCallTransactionTable,
    DashboardCard,
    PlayPauseButton,
    MessageTransactionTable,
  },

  props: {
    network: String
  },

  setup(props) {
    const isSmallScreen = inject('isSmallScreen', true)
    const isMediumScreen = inject('isMediumScreen', true)
    const isTouchDevice = inject('isTouchDevice', false)
    const isXLargeScreen = inject('isXLargeScreen', true)

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
      isXLargeScreen,
      cryptoTableController,
      messageTableController,
      contractTableController,
      TransactionType,
      isMainNetwork,
      currentNetworkDisplayName
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>

