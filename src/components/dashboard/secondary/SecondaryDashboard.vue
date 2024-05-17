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

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="accounts_associating_nfts"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="accounts_creating_nft_collections"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="accounts_minting_nfts"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="accounts_receiving_nfts"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="accounts_sending_nfts"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="active_nft_accounts"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="active_nft_builder_accounts"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="atma_transaction_fees"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="atma_transactions"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="nft_collections_created"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="nft_holders"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="nft_market_cap"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="nft_sales_volume"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="nfts_minted"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="nfts_transferred"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="other_transaction_fees"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="other_transactions"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="total_nfts"/>
      </div>

    </div>

    <div class="columns is-multiline">

      <div class="column" :class="{'is-full': !displaySideBySide}">
        <HgraphChart metric-name="transaction_fees"/>
      </div>

      <div class="column">
        <HgraphChart metric-name="transactions"/>
      </div>

    </div>





    <!--    <div class="columns">-->

    <!--      <div class="column">-->
    <!--        <Chart :controller="tpsChartController">-->
    <!--          <template v-slot:chartTitle><span class="h-is-secondary-title">TPS</span></template>-->
    <!--        </Chart>-->
    <!--      </div>-->

    <!--    </div>-->

    <!--    <div class="columns is-multiline">-->

    <!--      <div class="column" :class="{'is-full': !displaySideBySide}">-->
    <!--        <DashboardCard data-cy="smartContractCalls">-->
    <!--          <template v-slot:title>-->
    <!--            <span class="h-is-secondary-title">Smart Contract Calls</span>-->
    <!--          </template>-->
    <!--          <template v-slot:control>-->
    <!--            <PlayPauseButton v-bind:controller="contractTableController"/>-->
    <!--          </template>-->
    <!--          <template v-slot:content>-->
    <!--            <ContractCallTransactionTable v-bind:controller="contractTableController"/>-->
    <!--          </template>-->
    <!--        </DashboardCard>-->
    <!--      </div>-->

    <!--      <div class="column">-->
    <!--        <DashboardCard data-cy="hcsMessages">-->
    <!--          <template v-slot:title>-->
    <!--            <span class="h-is-secondary-title">HCS Messages</span>-->
    <!--          </template>-->
    <!--          <template v-slot:control>-->
    <!--            <PlayPauseButton v-bind:controller="messageTableController"/>-->
    <!--          </template>-->
    <!--          <template v-slot:content>-->
    <!--            <MessageTransactionTable v-bind:controller="messageTableController"/>-->
    <!--          </template>-->
    <!--        </DashboardCard>-->
    <!--      </div>-->

    <!--    </div>-->

  </section>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, inject} from "vue";
import HgraphChart from "@/components/chart/hgraph/HgraphChart.vue";

export default defineComponent({
  name: 'SecondaryDashboard',

  components: {
    HgraphChart
  },

  props: {
    network: String
  },

  setup() {
    const isSmallScreen = inject('isSmallScreen', true)
    const isTouchDevice = inject('isTouchDevice', false)
    const displaySideBySide = inject('isLargeScreen', true)
    return {
      isSmallScreen,
      isTouchDevice,
      displaySideBySide,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>

