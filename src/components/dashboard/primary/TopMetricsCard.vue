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
  <DashboardCard>
    <template v-slot:title>
      <span class="h-is-secondary-title">Top Metrics</span>
    </template>
    <template v-slot:content>

      <div class="is-flex is-flex-wrap-wrap" style="gap: 16px">

        <MetricBox>
          <template v-slot:metricTitle>Hbar Price</template>
          <template v-slot:metricValue>{{ hbarPrice }}</template>
          <template v-slot:metricVariation>
            <Variation :variation="hbarPriceVariation"/>
          </template>
        </MetricBox>

        <MetricBox>
          <template v-slot:metricTitle>Hbar Market Cap</template>
          <template v-slot:metricValue>{{ hbarMarketCap }}</template>
          <template v-slot:metricVariation>
            <Variation :variation="hbarMarketCapVariation"/>
          </template>
        </MetricBox>

        <MetricBox>
          <template v-slot:metricTitle>Hbar Released</template>
          <template v-slot:metricValue>{{ hbarReleased}}</template>
        </MetricBox>

        <MetricBox>
          <template v-slot:metricTitle>Hbar Total</template>
          <template v-slot:metricValue>{{ hbarTotal}}</template>
        </MetricBox>

        <MetricBox>
          <template v-slot:metricTitle>Total Number of Accounts</template>
          <template v-slot:metricValue>{{totalAccount}}</template>
        </MetricBox>

        <MetricBox>
          <template v-slot:metricTitle>Total Number of Transactions</template>
          <template v-slot:metricValue>{{totalTransaction}}</template>
        </MetricBox>

      </div>

    </template>

  </DashboardCard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, onBeforeUnmount, onMounted} from "vue";
import Variation from "@/components/dashboard/Variation.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import MetricBox from "@/components/dashboard/primary/MetricBox.vue";
import {HederaMetricsLoader} from "@/components/dashboard/primary/metrics/HederaMetricsLoader";
import {TotalAccountLoader, TotalTransactionLoader} from "@/components/dashboard/primary/metrics/HgraphMetricLoader";

export default defineComponent({
  name: 'TopMetricsCard',

  components: {
    MetricBox,
    DashboardCard,
    Variation
  },

  setup() {
    const hederaMetricsLoader = new HederaMetricsLoader()
    onMounted(() => hederaMetricsLoader.mount())
    onBeforeUnmount(() => hederaMetricsLoader.unmount())

    const totalAccountLoader = new TotalAccountLoader()
    onMounted(() => totalAccountLoader.mount())
    onBeforeUnmount(() => totalAccountLoader.unmount())

    const totalTransactionLoader = new TotalTransactionLoader()
    onMounted(() => totalTransactionLoader.mount())
    onBeforeUnmount(() => totalTransactionLoader.unmount())

    return {
      hbarPrice: hederaMetricsLoader.hbarPriceText,
      hbarMarketCap: hederaMetricsLoader.hbarMarketCapText,
      hbarReleased: hederaMetricsLoader.hbarReleasedText,
      hbarTotal: hederaMetricsLoader.hbarTotalText,
      hbarPriceVariation: hederaMetricsLoader.hbarPriceVariationText,
      hbarMarketCapVariation: hederaMetricsLoader.hbarMarketCapVariationText,
      totalAccount: totalAccountLoader.countText,
      totalTransaction: totalTransactionLoader.countText,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
