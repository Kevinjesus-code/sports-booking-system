import { BarChart } from "@mui/x-charts/BarChart";

/**
 * DSABarChart
 * @param {Object[]} dataset  - Array de objetos con los datos. Ej: [{ mes: "Ene", reservas: 12 }]
 * @param {Object}   config   - Configuración del gráfico:
 *   @param {string}   config.xKey       - Key del eje X en el dataset (ej: "mes")
 *   @param {string}   config.dataKey    - Key del valor a graficar (ej: "reservas")
 *   @param {string}   config.label      - Etiqueta de la serie
 *   @param {string}   [config.yLabel]   - Etiqueta del eje Y
 *   @param {string}   [config.color]    - Color de las barras
 *   @param {number}   [config.height]   - Altura del gráfico (default: 320)
 */
const DSABarChart = ({ dataset = [], config = {} }) => {
  const {
    xKey = "month",
    dataKey = "value",
    label = "",
    yLabel = "",
    color="#22c55e",
    height = 320,
  } = config;

  const valueFormatter = (value) => `${value} ${label.toLowerCase()}`;

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: xKey, tickPlacement: "middle", tickLabelPlacement: "middle" }]}
      yAxis={[{ label: yLabel, width: yLabel ? 70 : 40 }]}
      series={[
        {
          dataKey,
          label,
          valueFormatter,
          ...(color ? { color } : {}),
        },
      ]}
      height={height}
    />
  );
};

export default DSABarChart;
