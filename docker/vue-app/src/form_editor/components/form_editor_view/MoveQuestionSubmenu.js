export default {
    name: 'move-question-submenu',
    props: {
        indicatorID: Number,
        parentID: Number,
        currentListIndex: Number,
        currentListLength: Number,
    },
    inject: [
        'clickToMoveListItem',
        'parentID_select_options',
        'changeIndicatorParentID',
        'clickToMoveIncrement',
        'changeClickToMoveIncrement',
    ],
    computed: { },
    template: `<div :id="'question_location_submenu_' + indicatorID" class="move_indicator_container">
        <h3>Move Question Options</h3>
        <div class="move_indicator_controls">
            <div class="move_indicator_inputs" style="gap:0.625rem;">
                <button type="button" :disabled="currentListIndex === 0"
                    :id="'click_to_move_up_' + indicatorID" class="icon_move up"
                    :title="'move indicatorID ' + indicatorID + ' up'" :aria-label="'move indicatorID ' + indicatorID + ' up'"
                    @click.stop="clickToMoveListItem($event, indicatorID, true)">
                </button>
                <button type="button" :disabled="currentListIndex === currentListLength - 1"
                    :id="'click_to_move_down_' + indicatorID" class="icon_move down"
                    :title="'move indicatorID ' + indicatorID + ' down'" :aria-label="'move indicatorID ' + indicatorID + ' down'"
                    @click.stop="clickToMoveListItem($event, indicatorID, false)">
                </button>
            </div>
            <div class="move_indicator_inputs">
                <label for="increment_input">Step</label>
                <input type="number" id="increment_input" min="1" max="50" :disabled="currentListLength === 1"
                    :value="clickToMoveIncrement" style="width:50px" @change="changeClickToMoveIncrement" />
            </div>
            <div v-if="Object.keys(parentID_select_options).length > 0" class="move_indicator_inputs">
                <label for="parent_id_select">Parent ID</label>
                <select id="parent_id_select" @change="changeIndicatorParentID($event, indicatorID)">
                    <option value="">None (form section)</option>
                    <option v-for="option in parentID_select_options" :key="'select_parentID_' + option.indicatorID"
                        :value="option.indicatorID" :selected="option.indicatorID===parentID">
                        {{option.indicatorID}}: {{option.name}}
                    </option>
                </select>
            </div>
        </div>
    </div>`
}
