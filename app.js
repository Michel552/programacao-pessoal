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

        eventoEmEdicao = null;

        modal.close();

    }
);

async function carregarStatus() {

    const { data, error } =
        await supabaseClient
            .from("status_evento")
            .select("*");

    if (error) {

        console.error(error);
        return;

    }

    const ordemStatus = [
        "PLANEJAMENTO",
        "IDA",
        "VOLTA",
        "NÃO VIAJA",
        "HOME OFFICE",
        "FAMILIA",
        "FERIADO",
        "FERIAS"
    ];

    data.sort(
        (a, b) =>
            ordemStatus.indexOf(a.status) -
            ordemStatus.indexOf(b.status)
    );

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

function formatarData(data){

    if(!data){
        return "";
    }

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

function classeStatus(status){

    switch(status){

        case "IDA":
            return "status-ida";

        case "VOLTA":
            return "status-volta";

        case "FERIAS":
            return "status-ferias";

        case "FERIADO":
            return "status-feriado";

        case "HOME OFFICE":
            return "status-home-office";

        case "NÃO VIAJA":
            return "status-nao-viaja";

        case "FAMILIA":
            return "status-familia";

        case "PLANEJAMENTO":
            return "status-planejamento";

        default:
            return "";

    }

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
            <div class="evento-card">

                <div class="evento-status ${classeStatus(evento.status)}">
                    ${evento.status || ""}
                </div>

                <div class="evento-data">
                    ${formatarData(evento.data_inicio)}
                </div>

                <div class="evento-cia">
                    ${evento.cia || ""}
                </div>

                <div class="evento-trecho">
                    ${evento.origem || ""}
                    ${evento.origem && evento.destino ? " → " : ""}
                    ${evento.destino || ""}
                </div>

                <div class="evento-botoes">

                    <button
                        onclick="editarEvento(${evento.id})">

                        Editar

                    </button>

                    <button
                        onclick="excluirEvento(${evento.id})">

                        Excluir

                    </button>

                </div>

            </div>
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
                        .eq(
                            "id",
                            Number(eventoEmEdicao)
                        );

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

            eventoEmEdicao = null;

            modal.close();

            document
                .getElementById("formEvento")
                .reset();

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

    eventoEmEdicao = Number(id);

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

async function excluirEvento(id){

    const confirmar =
        confirm(
            "Deseja realmente excluir este evento?"
        );

    if(!confirmar){
        return;
    }

    const { error } =
        await supabaseClient
            .from("eventos")
            .delete()
            .eq("id", id);

    if(error){

        console.error(error);

        alert(
            "Erro ao excluir evento"
        );

        return;

    }

    carregarEventos();

}

carregarStatus();
carregarEventos();
