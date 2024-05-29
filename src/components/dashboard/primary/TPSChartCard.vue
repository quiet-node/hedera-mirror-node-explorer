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
  <ChartCard :chartController="controller">
    <template v-slot:chartTitle>Transactions per Second (TPS)</template>
  </ChartCard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted} from "vue";
import ChartCard from "@/components/dashboard/primary/chart/base/ChartCard.vue";
import {TPSChartController} from "@/components/dashboard/primary/chart/base/TPSChartController";

export default defineComponent({
  name: 'TPSChartCard',

  components: {
    ChartCard,
  },

  setup() {
    const controller = new TPSChartController()
    onMounted(() => controller.mount())
    onBeforeUnmount(() => controller.unmount())

    return {
      controller,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
