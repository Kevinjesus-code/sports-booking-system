import { LineChart } from "@mui/x-charts/LineChart";

/**
 * DSALineChart
 * @param {Object} data    - Datos del gráfico:
 *   @param {string[]} data.xValues  - Etiquetas del eje X (ej: ["Ene", "Feb"])
 *   @param {number[]} data.yValues  - Valores a graficar (ej: [43, 48, 61])
 * @param {Object} config  - Configuración del gráfico:
 *   @param {string}  config.label   - Etiqueta de la serie
 *   @param {string}  [config.color] - Color de la línea (default: "#22c55e")
 *   @param {string}  [config.curve] - Tipo de curva (default: "natural")
 *   @param {number}  [config.height]- Altura del gráfico (default: 280)
 */
const DSALineChart = ({ data = {}, config = {} }) => {
  const { xValues = [], yValues = [] } = data;
  const {
    label = "",
    color = "#22c55e",
    curve = "natural",
    height = 280,
  } = config;

  const valueFormatter = (value) => `${value} ${label.toLowerCase()}`;

  return (
    <LineChart
      xAxis={[{ data: xValues, scaleType: "point" }]}
      series={[
        {
          data: yValues,
          label,
          valueFormatter,
          curve,
          color,
        },
      ]}
      yAxis={[{ min: 0 }]}
      height={height}
    />
  );
};

export default DSALineChart;
