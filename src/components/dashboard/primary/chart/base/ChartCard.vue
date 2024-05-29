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
          <slot name="chartTitle"/>
        </template>
        <template v-slot:control>
          <PlayPauseButton :controller="playPauseController"/>
        </template>
        <template v-slot:content>
          <div ref="container" style="height:300px"/>
        </template>
    </DashboardCard>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

//
// https://www.amcharts.com/docs/v5/getting-started/integrations/vue/
//

import {computed, ComputedRef, defineComponent, PropType} from "vue"
import DashboardCard from "@/components/DashboardCard.vue";
import {ChartController} from "@/components/dashboard/primary/chart/base/ChartController";
import {EntityLoaderState, EntityLoaderV2} from "@/utils/loader/EntityLoaderV2";
import PlayPauseButton, {PlayPauseController} from "@/components/PlayPauseButton.vue";

export default defineComponent({
    components: {PlayPauseButton, DashboardCard},
    props: {
        chartController: {
            type: Object as PropType<ChartController>,
            required: true
        }
    },
    setup(props) {
        const loader = props.chartController.loader
        return {
          container: props.chartController.container,
          playPauseController: new LoaderPlayPauseController(loader),
          refreshEnabled: loader.refreshEnabled
        }
    }
})

export class LoaderPlayPauseController implements PlayPauseController {

  constructor(readonly loader: EntityLoaderV2<unknown>) {}

  readonly autoRefresh = computed(() => {
    return this.loader.state.value == EntityLoaderState.LOADING
        || this.loader.state.value == EntityLoaderState.SLEEPING
  })

  startAutoRefresh(): void {
    this.loader.resume()
  }

  stopAutoRefresh(): void {
    this.loader.pause()
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
