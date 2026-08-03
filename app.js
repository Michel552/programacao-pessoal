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

const selectStatus =
    document.getElementById("status");

let eventoEmEdicao = null;

btnNovoEvento.addEventListener(
    "click",
    () => {

        eventoEmEdicao = null;

        document
            .getElementById("formEvento")
            .reset();

        modal.showModal();

    }
);

btnCancelar.addEventListener(
    "click",
    () => {
        modal.close();
    }
);

async function carregarStatus() {

    const { data, error } =
        await supabaseClient
            .from("status_evento")
            .select("*")
            .order("status");

    if (error) {

        console.error(error);
        return;

    }

    selectStatus.innerHTML =
        '<option value="">Selecione</option>';

    data.forEach(item => {

        selectStatus.innerHTML += `
            <option value="${item.status}">
                ${item.status}
            </option>
        `;

    });

}

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

                <br><br>

                <button
                    onclick="editarEvento(${evento.id})">

                    Editar

                </button>

            </div>

            <hr>
        `;

    });

    document.getElementById(
        "calendario"
    ).innerHTML = html;

}

document
    .getElementById("formEvento")
    .addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const novoEvento = {

                status:
                    document
                        .getElementById("status")
                        .value,

                data_inicio:
                    document
                        .getElementById("data_inicio")
                        .value || null,

                data_fim:
                    document
                        .getElementById("data_fim")
                        .value || null,

                cia:
                    document
                        .getElementById("cia")
                        .value,

                origem:
                    document
                        .getElementById("origem")
                        .value,

                destino:
                    document
                        .getElementById("destino")
                        .value,

                descricao:
                    document
                        .getElementById("descricao")
                        .value,

                observacao:
                    document
                        .getElementById("observacao")
                        .value

            };

            let error;

            if (eventoEmEdicao !== null) {

                const resultado =
                    await supabaseClient
                        .from("eventos")
                        .update(novoEvento)
                        .eq("id", eventoEmEdicao);

                error =
                    resultado.error;

            } else {

                const resultado =
                    await supabaseClient
                        .from("eventos")
                        .insert([novoEvento]);

                error =
                    resultado.error;

            }

            if (error) {

                console.error(error);

                alert(
                    "Erro ao salvar evento"
                );

                return;

            }

            modal.close();

            document
                .getElementById("formEvento")
                .reset();

            eventoEmEdicao = null;

            carregarEventos();

        }
    );

async function editarEvento(id){

    const { data, error } =
        await supabaseClient
            .from("eventos")
            .select("*")
            .eq("id", id)
            .single();

    if(error){

        console.error(error);
        return;

    }

    eventoEmEdicao = id;

    document.getElementById("status").value =
        data.status || "";

    document.getElementById("data_inicio").value =
        data.data_inicio || "";

    document.getElementById("data_fim").value =
        data.data_fim || "";

    document.getElementById("cia").value =
        data.cia || "";

    document.getElementById("origem").value =
        data.origem || "";

    document.getElementById("destino").value =
        data.destino || "";

    document.getElementById("descricao").value =
        data.descricao || "";

    document.getElementById("observacao").value =
        data.observacao || "";

    modal.showModal();

}

carregarStatus();
carregarEventos();
