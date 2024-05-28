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

import {ChartController} from "@/components/dashboard/primary/chart/base/ChartController";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from "@amcharts/amcharts5";
import {EntityLoaderV2} from "@/utils/loader/EntityLoaderV2";

export abstract class XYChartController extends ChartController {

    private xAxis: am5xy.DateAxis<am5xy.AxisRenderer>|null = null
    private series: am5xy.XYSeries|null = null

    //
    // Protected (to be override if needed)
    //

    protected makeBaseInterval():  am5.time.ITimeInterval {
        return {
            timeUnit: "day",
            count: 1
        }
    }

    protected makeDataProcessor(root: am5.Root): am5.DataProcessor|null {
        return null
    }

    //
    // Protected
    //

    protected constructor(loader: EntityLoaderV2<object[]>,
                          readonly valueXField: string,
                          readonly valueYField: string,
                          readonly logarithmic: boolean) {
        super(loader)
    }

    //
    // ChartController
    //

    protected setup(root: am5.Root): void {
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        const chart = am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            paddingLeft: 0
        })
        root.container.children.push(chart);


        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        const cursor = am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        })
        cursor.lineY.set("visible", false);
        chart.set("cursor", cursor);


        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        this.xAxis = am5xy.DateAxis.new(root, {
            maxDeviation: 0,
            baseInterval: this.makeBaseInterval(),
            renderer: am5xy.AxisRendererX.new(root, {
                minorGridEnabled:true,
                minorLabelsEnabled:true
            }),
            // tooltip: am5.Tooltip.new(root, {})
        })
        //
        // xAxis.set("minorDateFormats", {
        //     "day":"dd",
        //     "month":"MM"
        // });
        chart.xAxes.push(this.xAxis);

        const yAxis = am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
            logarithmic: this.logarithmic
        })
        chart.yAxes.push(yAxis);


        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        const series = am5xy.LineSeries.new(root, {
            name: "Series",
            xAxis: this.xAxis,
            yAxis: yAxis,
            valueYField: this.valueYField,
            valueXField: this.valueXField,
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        })
        series.fills.template.setAll({
            fillOpacity: 0.2,
            visible: true
        })
        series.strokes.template.setAll({
            strokeOpacity: 0.9,
            visible: true
        })
        chart.series.push(series)
        this.series = series

        // Setup data processor
        const processor = this.makeDataProcessor(root)
        if (processor !== null) {
            this.series.data.processor = processor
        }

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        // chart.set("scrollbarX", am5.Scrollbar.new(root, {
        //     orientation: "horizontal"
        // }));


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        // series.appear(1000);
        // chart.appear(1000, 100);
    }

    protected populate(data: object[] | null): void {
        this.series?.data.setAll(data ?? [])
        this.xAxis?.set("baseInterval", this.makeBaseInterval())
    }
}