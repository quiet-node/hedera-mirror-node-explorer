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

import {computed, ref, Ref, watch, WatchStopHandle} from "vue";
import {LabelByIdCache} from "@/utils/cache/LabelByIdCache";

export class LabelQuery {

    public readonly entityId: Ref<string|null>
    private readonly resolved = ref(false)
    private readonly labelRecord = ref<LabelRecord|null>(null)
    private watchHandle: WatchStopHandle|null = null

    //
    // Public
    //

    public constructor(entityId: Ref<string|null>) {
        this.entityId = entityId
    }

    public mount(): void {
        this.watchHandle = watch(this.entityId, this.entityIdDidChange, {immediate: true} )
    }

    public unmount(): void {
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
        this.labelRecord.value = null
    }

    public readonly label = computed(
        () => this.labelRecord.value !== null ? this.labelRecord.value.label : null)

    public readonly hasNoLabel = computed(
        () => this.labelRecord.value === null && this.resolved.value)

    //
    // Private
    //

    private readonly entityIdDidChange = () => {
        const newValue = this.entityId.value
        if (newValue !== null) {
            // Keeps this.labelRecord.value and this.resolved.value unchanged to avoid flash
            LabelByIdCache.instance.lookup(newValue)
                .then((label: string|null) => {
                    if (label !== null) {
                        this.labelRecord.value = new LabelRecord(label, [], "")
                    } else {
                        this.labelRecord.value = null
                    }
                })
                .catch((/* reason: unknown */) => {
                    this.labelRecord.value = null
                })
                .finally(() => {
                    this.resolved.value = true
                })
        } else {
            this.labelRecord.value = null
            this.resolved.value = false
        }
    }

}


export class LabelRecord {
    public readonly label: string
    public readonly tags: string[]
    public readonly note: string
    public constructor(label: string, tags: string[], note: string) {
        this.label = label
        this.tags = tags
        this.note = note
    }

    public static readonly EMPTY_LABEL = new LabelRecord("", [], "")
}
