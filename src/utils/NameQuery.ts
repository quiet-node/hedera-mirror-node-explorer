/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {computed, ref, watch, WatchStopHandle} from "vue";
import {KNSCache} from "@/utils/cache/KNSCache";
import {HNSCache} from "@/utils/cache/HNSCache";
import {LabelQuery} from "@/utils/LabelQuery";

export class NameQuery {

    private readonly labelQuery: LabelQuery
    private readonly knsNames = ref<NameRecord[]>([])
    private readonly hnsNames = ref<NameRecord[]>([])
    private watchHandle: WatchStopHandle|null = null

    //
    // Public
    //

    public constructor(labelQuery: LabelQuery) {
        this.labelQuery = labelQuery
    }

    public mount(): void {
        this.watchHandle = watch(
            [this.labelQuery.entityId, this.labelQuery.label],
            this.updateNames, {immediate: true} )
    }

    public unmount(): void {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
    }

    public readonly primaryName = computed<NameRecord|null>(() => {
        const knsName = this.knsNames.value.length >= 1 ? this.knsNames.value[0] : null
        const hnsName = this.hnsNames.value.length >= 1 ? this.hnsNames.value[0] : null
        return  knsName ?? hnsName
    })

    public readonly label = computed<string|null>(() => {
        return this.labelQuery.label.value ?? this.primaryName.value?.name ?? null
   })

    //
    // Private
    //

    private readonly updateNames = () => {
        const newEntityId = this.labelQuery.entityId.value
        if (newEntityId !== null && this.labelQuery.hasNoLabel.value) {
            this.startUpdatingKNS(newEntityId)
            this.startUpdatingHNS(newEntityId)
        } else {
            this.knsNames.value = []
            this.hnsNames.value = []
        }
    }

    private startUpdatingKNS(newEntityId: string): void {
        KNSCache.instance.lookup(newEntityId)
            .then((names: string[]) => {
                this.updateKNS(newEntityId, names)
            })
            .catch(() => {
                this.updateKNS(newEntityId, [])
            })
    }

    private updateKNS(newEntityId: string, names: string[]): void {
        if (this.labelQuery.entityId.value == newEntityId) {
            this.knsNames.value = NameQuery.makeNameRecords(names, NameSource.KNS)
        } // else silently exits because entity id has been changed during resolution
    }

    private startUpdatingHNS(newEntityId: string): void {
        HNSCache.instance.lookup(newEntityId)
            .then((names: string[]) => {
                this.updateHNS(newEntityId, names)
            })
            .catch(() => {
                this.updateHNS(newEntityId, [])
            })
    }

    private updateHNS(newEntityId: string, names: string[]): void {
        if (this.labelQuery.entityId.value == newEntityId) {
            this.knsNames.value = NameQuery.makeNameRecords(names, NameSource.HNS)
        } // else silently exits because entity id has been changed during resolution
    }

    private static makeNameRecords(names: string[], source: NameSource): NameRecord[] {
        const result: NameRecord[] = []
        for (const n of names) {
            result.push({name: n, source: source})
        }
        return result
    }
}

export class NameRecord {
    public readonly name: string
    public readonly source: NameSource
    public constructor(name: string, source: NameSource) {
        this.name = name
        this.source = source
    }
}

export enum NameSource {
    KNS, HNS
}
