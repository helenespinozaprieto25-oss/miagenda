package com.ejemplo.miagenda

import android.app.DatePickerDialog
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

// Niveles de prioridad disponibles para cada actividad
enum class Prioridad(val etiqueta: String, val colorTexto: Color) {
    BAJA("Baja", Color(0xFF047857)),
    MEDIA("Media", Color(0xFFB45309)),
    ALTA("Alta", Color(0xFFB91C1C))
}

// Modelo simple para cada actividad en memoria
data class Actividad(
    val id: Int,
    val texto: String,
    val fecha: String,
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)

fun obtenerFechaDeHoy(): String {
    val formato = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
    return formato.format(Date())
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaPantalla()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaPantalla() {
    val contexto = LocalContext.current

    // Estado en memoria: se conserva solo mientras la aplicación está abierta
    var textoActividad by remember { mutableStateOf("") }
    var textoBusqueda by remember { mutableStateOf("") }
    var fechaSeleccionada by remember { mutableStateOf("") }
    var prioridadSeleccionada by remember { mutableStateOf(Prioridad.MEDIA) }
    var mostrarError by remember { mutableStateOf(false) }
    var siguienteId by remember { mutableIntStateOf(1) }
    val actividades = remember { mutableStateListOf<Actividad>() }

    val actividadesFiltradas = if (textoBusqueda.isBlank()) {
        actividades
    } else {
        actividades.filter {
            it.texto.contains(textoBusqueda.trim(), ignoreCase = true)
        }
    }

    val totalActividades = actividades.size
    val completadasCount = actividades.count { it.completada }
    val progreso = if (totalActividades > 0) {
        completadasCount.toFloat() / totalActividades
    } else {
        0f
    }
    val porcentajeCompletado = (progreso * 100).toInt()

    // Estado del diálogo de edición
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }
    var textoEdicion by remember { mutableStateOf("") }
    var fechaEdicion by remember { mutableStateOf("") }
    var mostrarErrorEdicion by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Mi Agenda") }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(16.dp)
        ) {
            // Campo para escribir una actividad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = { nuevoTexto ->
                    textoActividad = nuevoTexto
                    if (mostrarError && nuevoTexto.trim().isNotEmpty()) {
                        mostrarError = false
                    }
                },
                label = { Text("Escribe una actividad") },
                isError = mostrarError,
                supportingText = {
                    if (mostrarError) {
                        Text(text = "Debes escribir una actividad para poder agregarla.")
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Selector sencillo de fecha (opcional; si no se elige, usa la fecha de hoy)
            OutlinedButton(
                onClick = {
                    val calendario = Calendar.getInstance()
                    DatePickerDialog(
                        contexto,
                        { _, anio, mes, dia ->
                            fechaSeleccionada = String.format(
                                Locale.getDefault(),
                                "%02d/%02d/%04d",
                                dia,
                                mes + 1,
                                anio
                            )
                        },
                        calendario.get(Calendar.YEAR),
                        calendario.get(Calendar.MONTH),
                        calendario.get(Calendar.DAY_OF_MONTH)
                    ).show()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null
                )
                Text(
                    text = if (fechaSeleccionada.isEmpty()) {
                        "Elegir fecha (hoy por defecto)"
                    } else {
                        "Fecha elegida: $fechaSeleccionada"
                    },
                    modifier = Modifier.padding(start = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Selector de prioridad (Baja, Media, Alta)
            Text(
                text = "Prioridad",
                style = MaterialTheme.typography.labelLarge
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Prioridad.entries.forEach { nivel ->
                    val estaSeleccionada = prioridadSeleccionada == nivel
                    if (estaSeleccionada) {
                        Button(
                            onClick = { prioridadSeleccionada = nivel },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = nivel.colorTexto,
                                contentColor = Color.White
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                        ) {
                            Text(text = nivel.etiqueta)
                        }
                    } else {
                        OutlinedButton(
                            onClick = { prioridadSeleccionada = nivel },
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                        ) {
                            Text(text = nivel.etiqueta)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Botón para agregar la actividad a la lista
            Button(
                onClick = {
                    val textoLimpio = textoActividad.trim()
                    if (textoLimpio.isEmpty()) {
                        mostrarError = true
                    } else {
                        val fechaFinal = fechaSeleccionada.ifEmpty { obtenerFechaDeHoy() }
                        actividades.add(
                            Actividad(
                                id = siguienteId,
                                texto = textoLimpio,
                                fecha = fechaFinal,
                                prioridad = prioridadSeleccionada
                            )
                        )
                        siguienteId++
                        textoActividad = ""
                        fechaSeleccionada = ""
                        prioridadSeleccionada = Prioridad.MEDIA
                        mostrarError = false
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(text = "Agregar actividad")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tarjeta de resumen con barra de progreso visual
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(14.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Progreso de tareas",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "$completadasCount de $totalActividades completadas",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(
                            text = "$porcentajeCompletado%",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    LinearProgressIndicator(
                        progress = { progreso },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp))
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Barra de búsqueda en tiempo real sobre la lista
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Lista de actividades agregadas
            if (actividades.isEmpty()) {
                Text(
                    text = "Todavía no hay actividades. Escribe una arriba para comenzar.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else if (actividadesFiltradas.isEmpty()) {
                Text(
                    text = "No se encontraron actividades que coincidan con la búsqueda.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(
                        items = actividadesFiltradas,
                        key = { actividad -> actividad.id }
                    ) { actividad ->
                        ElementoActividad(
                            actividad = actividad,
                            onCambiarCompletada = {
                                val indice = actividades.indexOfFirst { it.id == actividad.id }
                                if (indice != -1) {
                                    actividades[indice] = actividad.copy(
                                        completada = !actividad.completada
                                    )
                                }
                            },
                            onEditar = {
                                actividadEnEdicion = actividad
                                textoEdicion = actividad.texto
                                fechaEdicion = actividad.fecha
                                mostrarErrorEdicion = false
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }

    // Diálogo sencillo para editar el nombre y la fecha de una actividad
    val actividadActual = actividadEnEdicion
    if (actividadActual != null) {
        AlertDialog(
            onDismissRequest = {
                actividadEnEdicion = null
                mostrarErrorEdicion = false
            },
            title = { Text(text = "Editar actividad") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = textoEdicion,
                        onValueChange = { nuevoTexto ->
                            textoEdicion = nuevoTexto
                            if (mostrarErrorEdicion && nuevoTexto.trim().isNotEmpty()) {
                                mostrarErrorEdicion = false
                            }
                        },
                        label = { Text("Nombre de la actividad") },
                        isError = mostrarErrorEdicion,
                        supportingText = {
                            if (mostrarErrorEdicion) {
                                Text(text = "Debes escribir una actividad para guardar.")
                            }
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedButton(
                        onClick = {
                            val calendario = Calendar.getInstance()
                            DatePickerDialog(
                                contexto,
                                { _, anio, mes, dia ->
                                    fechaEdicion = String.format(
                                        Locale.getDefault(),
                                        "%02d/%02d/%04d",
                                        dia,
                                        mes + 1,
                                        anio
                                    )
                                },
                                calendario.get(Calendar.YEAR),
                                calendario.get(Calendar.MONTH),
                                calendario.get(Calendar.DAY_OF_MONTH)
                            ).show()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = null
                        )
                        Text(
                            text = "Fecha: $fechaEdicion",
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val textoLimpio = textoEdicion.trim()
                        if (textoLimpio.isEmpty()) {
                            mostrarErrorEdicion = true
                        } else {
                            val indice = actividades.indexOfFirst { it.id == actividadActual.id }
                            if (indice != -1) {
                                actividades[indice] = actividadActual.copy(
                                    texto = textoLimpio,
                                    fecha = fechaEdicion.ifEmpty { obtenerFechaDeHoy() }
                                )
                            }
                            actividadEnEdicion = null
                            mostrarErrorEdicion = false
                        }
                    }
                ) {
                    Text(text = "Guardar")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        actividadEnEdicion = null
                        mostrarErrorEdicion = false
                    }
                ) {
                    Text(text = "Cancelar")
                }
            }
        )
    }
}

@Composable
fun ElementoActividad(
    actividad: Actividad,
    onCambiarCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Control para marcar la actividad como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onCambiarCompletada() }
            )

            // Nombre, fecha y prioridad de la actividad
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = actividad.texto,
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = actividad.fecha,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "·",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Prioridad ${actividad.prioridad.etiqueta}",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        color = if (actividad.completada) {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        } else {
                            actividad.prioridad.colorTexto
                        }
                    )
                }
            }

            // Botón para editar la actividad
            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad"
                )
            }

            // Botón para eliminar la actividad
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad"
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MiAgendaPreview() {
    MaterialTheme {
        MiAgendaPantalla()
    }
}
