import { useState } from "react";
import fondo from "./assets/fondo-chino.avif";

const Card = ({ children }) => (
  <div style={{
    border: "1px solid rgba(255,215,0,0.4)",
    borderRadius: "12px",
    padding: "16px",
    background: "rgba(139,0,0,0.7)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 0 15px rgba(255,215,0,0.2)"
  }}>
    {children}
  </div>
);

const Button = ({ children, ...props }) => (
  <button
    style={{
      background: "linear-gradient(45deg, rgba(184,134,11,0.9), rgba(255,215,0,0.9))",
      color: "#2b0000",
      padding: "8px 14px",
      borderRadius: "6px",
      border: "1px solid rgba(255,215,0,0.6)",
      cursor: "pointer",
      margin: "5px",
      width: "auto"
    }}
    {...props}
  >
    {children}
  </button>
);

export default function RestauranteDemo() {
  const [screen, setScreen] = useState("home");

  // CAJA
  const [cajaTotal, setCajaTotal] = useState(0);

  // MESAS (cada mesa con su cuenta)
  const [mesas, setMesas] = useState([
    { id: 1, pedidos: [] },
    { id: 2, pedidos: [] }
  ]);
  const [nuevaMesa, setNuevaMesa] = useState("");
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const agregarMesa = () => {
    if (!nuevaMesa || mesas.find(m => m.id === Number(nuevaMesa))) return;
    setMesas([...mesas, { id: Number(nuevaMesa), pedidos: [] }]);
    setNuevaMesa("");
  };

  const eliminarMesa = (id) => {
    setMesas(mesas.filter(m => m.id !== id));
    if (mesaSeleccionada === id) setMesaSeleccionada(null);
  };

  const agregarProductoMesa = (producto) => {
    setMesas(mesas.map(m =>
      m.id === mesaSeleccionada
        ? { ...m, pedidos: [...m.pedidos, producto] }
        : m
    ));
  };

  const cerrarMesa = (id) => {
    const mesa = mesas.find(m => m.id === id);
    const total = mesa.pedidos.reduce((acc, p) => acc + Number(p.precio), 0);
    setCajaTotal(cajaTotal + total);
    setMesas(mesas.map(m => m.id === id ? { ...m, pedidos: [] } : m));
  };

  // PRODUCTOS
  const [productos, setProductos] = useState([
    { nombre: "Arroz chino", precio: 15000 },
    { nombre: "Pollo agridulce", precio: 18000 }
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });

  const agregarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    setProductos([...productos, nuevoProducto]);
    setNuevoProducto({ nombre: "", precio: "" });
  };

  // PEDIDO RAPIDO
  const [pedidoRapido, setPedidoRapido] = useState([]);

  const procesarRapido = () => {
    const total = pedidoRapido.reduce((acc, p) => acc + Number(p.precio), 0);
    setCajaTotal(cajaTotal + total);
    setPedidoRapido([]);
  };

  // DOMICILIOS
  const [domicilios, setDomicilios] = useState([]);
  const [domActual, setDomActual] = useState({ cliente: "", direccion: "", pedidos: [] });

  const agregarProductoDomicilio = (producto) => {
    setDomActual({ ...domActual, pedidos: [...domActual.pedidos, producto] });
  };

  const crearDomicilio = () => {
    if (!domActual.cliente || domActual.pedidos.length === 0) return;
    setDomicilios([...domicilios, { ...domActual, id: Date.now() }]);
    setDomActual({ cliente: "", direccion: "", pedidos: [] });
  };

  const cerrarDomicilio = (id, entregado) => {
    const dom = domicilios.find(d => d.id === id);
    const total = dom.pedidos.reduce((acc, p) => acc + Number(p.precio), 0);

    if (entregado) {
      setCajaTotal(cajaTotal + total);
    }

    setDomicilios(domicilios.filter(d => d.id !== id));
  };

  const renderScreen = () => {
    switch (screen) {

      case "mesa":
        return (
          <Card>
            <h2 style={{ color: "gold" }}>Mesas</h2>

            <input
              type="number"
              placeholder="Número de mesa"
              value={nuevaMesa}
              onChange={(e) => setNuevaMesa(e.target.value)}
            />
            <Button onClick={agregarMesa}>Agregar mesa</Button>

            <h3>Mesas</h3>
            {mesas.map(m => (
              <div key={m.id}>
                <Button onClick={() => setMesaSeleccionada(m.id)}>
                  Mesa {m.id}
                </Button>
                <Button onClick={() => eliminarMesa(m.id)}>❌</Button>
                <Button onClick={() => cerrarMesa(m.id)}>Cerrar</Button>
              </div>
            ))}

            {mesaSeleccionada && (
              <>
                <h3>Cuenta Mesa {mesaSeleccionada}</h3>
                {mesas.find(m => m.id === mesaSeleccionada)?.pedidos.map((p, i) => (
                  <div key={i}>{p.nombre} - ${p.precio}</div>
                ))}

                <h3>Agregar productos</h3>
                {productos.map((p, i) => (
                  <Button key={i} onClick={() => agregarProductoMesa(p)}>
                    {p.nombre}
                  </Button>
                ))}
              </>
            )}
          </Card>
        );

      case "rapido":
        return (
          <Card>
            <h2 style={{ color: "gold" }}>Pedido Rápido</h2>

            {productos.map((p, i) => (
              <Button key={i} onClick={() => setPedidoRapido([...pedidoRapido, p])}>
                {p.nombre}
              </Button>
            ))}

            <h3>Pedido</h3>
            {pedidoRapido.map((p, i) => (
              <div key={i}>{p.nombre}</div>
            ))}

            <Button onClick={procesarRapido}>Procesar</Button>
          </Card>
        );

      case "domicilio":
        return (
          <Card>
            <h2 style={{ color: "gold" }}>Domicilios</h2>

            <input
              placeholder="Cliente"
              value={domActual.cliente}
              onChange={(e) => setDomActual({ ...domActual, cliente: e.target.value })}
            />
            <input
              placeholder="Dirección"
              value={domActual.direccion}
              onChange={(e) => setDomActual({ ...domActual, direccion: e.target.value })}
            />

            <h3>Agregar productos</h3>
            {productos.map((p, i) => (
              <Button key={i} onClick={() => agregarProductoDomicilio(p)}>
                {p.nombre}
              </Button>
            ))}

            <Button onClick={crearDomicilio}>Crear domicilio</Button>

            <h3>Activos</h3>
            {domicilios.map(d => (
              <div key={d.id}>
                <p>{d.cliente} - {d.direccion}</p>
                <Button onClick={() => cerrarDomicilio(d.id, true)}>Entregado</Button>
                <Button onClick={() => cerrarDomicilio(d.id, false)}>Cancelado</Button>
              </div>
            ))}
          </Card>
        );

      case "caja":
        return (
          <Card>
            <h2 style={{ color: "gold" }}>Caja</h2>
            <p>Total: ${cajaTotal}</p>
          </Card>
        );

      case "config":
        return (
          <Card>
            <h2 style={{ color: "gold" }}>Configuración</h2>

            <input
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            />
            <input
              placeholder="Precio"
              type="number"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            />
            <Button onClick={agregarProducto}>Guardar producto</Button>

            {productos.map((p, i) => (
              <div key={i}>{p.nombre}</div>
            ))}
          </Card>
        );

      default:
        return (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Button onClick={() => setScreen("mesa")}>Mesa</Button>
            <Button onClick={() => setScreen("rapido")}>Rápido</Button>
            <Button onClick={() => setScreen("domicilio")}>Domicilio</Button>
            <Button onClick={() => setScreen("caja")}>Caja</Button>
            <Button onClick={() => setScreen("config")}>Configuración</Button>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "20px"
      }}
    >
      <div style={{ position: "fixed", inset: 0, background: "rgba(30,0,0,0.6)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ color: "gold" }}>Demo Sistema Restaurante</h1>

        {screen !== "home" && (
          <Button onClick={() => setScreen("home")}>Volver</Button>
        )}

        {renderScreen()}
      </div>
    </div>
  );
}