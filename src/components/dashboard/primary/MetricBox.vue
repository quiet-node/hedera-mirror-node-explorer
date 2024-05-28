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

  <div class="is-flex is-flex-direction-column h-has-page-background p-4" style="width: 300px; height: 100px">
    <div>
      <slot name="metricTitle"/>
    </div>
    <div class="dashboard-value">
      <slot name="metricValue"/>
    </div>
    <div>
      <slot name="metricVariation"/>
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent} from "vue";
import DashboardItem from "@/components/dashboard/DashboardItem.vue";
import Variation from "@/components/dashboard/Variation.vue";

export default defineComponent({
  name: 'MetricBox',

  components: {
    Variation,
    DashboardItem
  },

  setup() {
    return {
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->


<style scoped>

.dashboard-value {
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.05em;
}

</style>
