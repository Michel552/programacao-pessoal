const SUPABASE_URL =
    "https://tezarjtyutsmeahxwuzy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_62tn0na4O2RmOuT2qIKcag_jdzVU3_Z";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

const modal =
    document.getElementById("modalEvento");

const btnNovoEvento =
    document.getElementById("novoEventoBtn");

const btnCancelar =
    document.getElementById("cancelarBtn");

btnNovoEvento.addEventListener(
    "click",
    () => {
        modal.showModal();
    }
);

btnCancelar.addEventListener(
    "click",
    () => {
        modal.close();
    }
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
            "calendario"
        ).innerHTML =
            "<h2>Erro ao carregar eventos</h2>";

        return;
    }

    let html =
        "<h2>Eventos cadastrados</h2>";

    data.forEach(evento => {

        html += `
            <div>

                <strong>
                    ${evento.status}
                </strong>

                <br>

                ${evento.data_inicio}

            </div>

            <hr>
        `;
    });

    document.getElementById(
        "calendario"
    ).innerHTML = html;
}

carregarEventos();
