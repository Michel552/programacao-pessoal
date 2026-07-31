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
    
    console.log(data);
    console.log(selectStatus.innerHTML);
    
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
            
            console.log("SUBMIT EXECUTADO");
            
            const novoEvento = {

                status:
                    document
                        .getElementById("status")
                        .value,

                data_inicio:
                    document
                        .getElementById("data_inicio")
                        .value,

                data_fim:
                    document
                        .getElementById("data_fim")
                        .value,

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

            const { error } =
                await supabaseClient
                    .from("eventos")
                    .insert([novoEvento]);

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

            carregarEventos();

        }
    );

carregarStatus();
carregarEventos();
