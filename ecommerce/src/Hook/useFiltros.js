import { useState, useMemo, useEffect } from "react";

export const useFiltros = (productosIniciales) => {
 
  const [filtros, setFiltros] = useState(() => {
    const filtrosGuardados = localStorage.getItem("filtros_tienda");
    return filtrosGuardados 
      ? JSON.parse(filtrosGuardados) 
      : { busqueda: "", categoria: "Todos", precioMaximo: 1000000 };
  });
  useEffect(() => {
    localStorage.setItem("filtros_tienda", JSON.stringify(filtros));
  }, [filtros]);

  const productosFiltrados = useMemo(() => {
    return productosIniciales.filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());
      
      const coincideCategoria = 
        filtros.categoria === "Todos" ||
        producto.categoria === filtros.categoria;
      
      const coincidePrecio = producto.precio <= filtros.precioMaximo;

      return coincideNombre && coincideCategoria && coincidePrecio;
    });
  }, [productosIniciales, filtros]);

  
  const actualizarFiltro = (nombre, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({ busqueda: "", categoria: "Todos", precioMaximo: 1000000 });
  };

  return {
    filtros,
    actualizarFiltro,
    productosFiltrados,
    limpiarFiltros
  };
};