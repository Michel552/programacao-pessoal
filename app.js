const SUPABASE_URL =
    "https://tezarjtyutsmeahxwuzy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_62tn0na4O2RmOuT2qIKcag_jdzVU3_Z";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

async function carregarEventos() {

    const { data, error } =
        await supabaseClient
            .from("eventos")
            .select("*")
            .order("data_inicio");

    if (error) {

        console.error(error);

        document.getElementById(
            "mesesContainer"
        ).innerHTML =
            "<p>Erro ao carregar eventos.</p>";

        return;
    }

    let html = "<h2>Eventos cadastrados</h2>";

    data.forEach(evento => {

        html += `
            <div class="card">

                <strong>
                    ${evento.status}
                </strong>

                <br>

                ${evento.data_inicio}

                ${evento.data_fim
                    ? " até " + evento.data_fim
                    : ""
                }

                <br>

                ${evento.cia || ""}

                ${evento.origem
                    ? evento.origem + " → "
                    : ""
                }

                ${evento.destino || ""}

            </div>
        `;
    });

    document.getElementById(
        "dashboard"
    ).innerHTML = "";

    document.getElementById(
        "periodoSelect"
    ).style.display = "none";

    document.getElementById(
        "mesesContainer"
    ).innerHTML = html;
}

carregarEventos();