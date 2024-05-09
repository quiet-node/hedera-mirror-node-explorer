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
  <Chart :controller="controller">
    <template v-slot:chartTitle>{{metricName.toUpperCase()}}<span class="has-text-grey"> per day</span></template>
  </Chart>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

//
// https://www.amcharts.com/docs/v5/getting-started/integrations/vue/
//

import {defineComponent, onBeforeUnmount, onMounted, PropType} from "vue"
import DashboardCard from "@/components/DashboardCard.vue";
import {ChartController} from "@/components/chart/base/ChartController";
import Chart from "@/components/chart/base/Chart.vue";
import {HgraphChartController} from "@/components/chart/hgraph/HgraphChartController";

export default defineComponent({
  components: {Chart, DashboardCard},
  props: {
    metricName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const controller = new HgraphChartController(props.metricName)
    onMounted(() => {
      controller.mount()
    })
    onBeforeUnmount(() => {
      controller.unmount()
    })

    return {
      controller
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
